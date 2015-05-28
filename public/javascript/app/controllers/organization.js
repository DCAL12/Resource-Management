(function() {
	'use strict';
	
	angular
		.module('app')
		.controller('OrganizationController', OrganizationController);
	
	// Protect injection parameter names from minification alteration
	OrganizationController.$inject = ['$routeParams', 'api', 'ngDialog', '$scope', '$location'];
	
	function OrganizationController($routeParams, api, ngDialog, $scope, $location) {
		var viewModel = this,
			organizationId = $routeParams.organizationId;
			
		viewModel.resourceTypes = [];
		viewModel.tab = {
			tabs: ['timeline', 'requests', 'resources', 'organization'],
			activeTab: 'timeline',
			setActiveTab: function(tabName) {viewModel.tab.activeTab = tabName}
		};
			
		api.getOrganizationDetails(organizationId)
			.then(function(data) {
				viewModel.organization = data;
			});
			
		api.getRole(organizationId)
			.then(function(result) {
				viewModel.role = result ? 
					result.role :
					viewModel.organization.settings.defaultAccess;
			});
			
		api.getAllRoles(organizationId)
			.then(function(results) {
				viewModel.userRoles = results;
			});
		
		api.getRequests(organizationId)
			.then(function(data) {
				viewModel.requests = data;
			});
			
		api.getResourceTypes(organizationId)
			.then(function(resourceTypes) {
				
				if (resourceTypes && resourceTypes.length > 0) {
					viewModel.resourceTypes = resourceTypes;
					viewModel.resourceWidget.selectType(resourceTypes[0]);	
				}
			});
			
		viewModel.requestWidget = {
			createRequest: {
				dialog: function() {
					ngDialog.open({
						template: 'javascript/app/views/dialogs/createRequest.html',
						className: 'ngdialog-theme-default',
						scope: $scope
					});
				},
				submit: function() {
					
					
					console.log(viewModel.requestWidget.createRequest.data);
					viewModel.requestWidget.createRequest.processing = true;
					api.addRequest(organizationId, 
						viewModel.requestWidget.createRequest.data)
							.then(function(response) {
								
								if (response && response.error) {
									alert('Something went wrong...');
								}
								else {
									alert('Your request has been submitted');
									api.getRequest(organizationId, response)
										.then(function(result) {
											viewModel.requests.push(result);
										});
								}
								viewModel.requestWidget.createRequest.processing = false;
								viewModel.requestWidget.createRequest.data = null;
							});
					ngDialog.close();
				}
			},
			updateRequest: function(request) {
				api.updateRequest(organizationId, request._id, {status: request.status})
					.then(function(response) {
							
							if (response && response.error) {
								alert('Something went wrong...');
							}
							
						});
			},
			cancelRequest: function(request) {
				api.updateRequest(organizationId, request._id, {status: 'cancelled'})
					.then(function(response) {
						
						if (response && response.error) {
								alert('Something went wrong...');
							}	
					});
			}
		};
			
		viewModel.resourceWidget = {
			selectType: function(resourceType) {
				viewModel.resourceTypes.selected = resourceType;
				viewModel.resources = null;
				
				api.getResources(organizationId, resourceType._id)
					.then(function(data) {
						viewModel.resources = data;
						viewModel.resources.attributes = resourceType.attributes;
					});
			},
			createResourceType: {
				dialog: function() {
					ngDialog.open({
						template: 'javascript/app/views/dialogs/createResourceType.html',
						className: 'ngdialog-theme-default',
						scope: $scope
					});
				},
				submit: function() {
					viewModel.resourceWidget.createResourceType.processing = true;
					api.addResourceType(organizationId, 
						viewModel.resourceWidget.createResourceType.data)
							.then(function(response) {
								
								if (response && response.error) {
									alert('Something went wrong...');
								}
								
								viewModel.resourceWidget.createResourceType.processing = false;
								viewModel.resourceTypes.push(viewModel.resourceWidget.createResourceType.data);
								viewModel.resourceWidget.createResourceType.data = null;
								
								// Select the newly created resourceType for editing
								
								api.getResourceTypeByID(organizationId, response)
									.then(function(response) {
										
										if (response && response.error) {
											alert('Something went wrong...');
										}
										viewModel.resourceWidget.selectType(response);
									});
							});
							ngDialog.close();
				}
			},
			addAttribute: {
				dialog: function() {
					ngDialog.open({
						template: 'javascript/app/views/dialogs/addAttribute.html',
						className: 'ngdialog-theme-default',
						scope: $scope
					});
				},
				submit: function() {
					viewModel.resourceWidget.addAttribute.processing = true;
					
					api.addResourceTypeAttribute(
						viewModel.resourceTypes.selected._id, 
						viewModel.resourceWidget.addAttribute.data)
							.then(function(response) {
								
								if (response && response.error) {
									alert('Something went wrong...');
								}
								
								viewModel.resourceWidget.addAttribute.processing = false;
								viewModel.resources.attributes.push(viewModel.resourceWidget.addAttribute.data);
								viewModel.resourceWidget.addAttribute.data = null;
							});
							ngDialog.close();
				}
			},
			addResource: {
				submit: function() {
					viewModel.resourceWidget.addResource.processing = true;
					api.addResource(organizationId, 
						viewModel.resourceTypes.selected._id, 
						viewModel.resourceWidget.addResource.data)
							.then(function(response) {
								
								if (response && response.error) {
									alert('Something went wrong...');
								}
								
								viewModel.resourceWidget.addResource.processing = false;
								viewModel.resources.push(viewModel.resourceWidget.addResource.data);
								viewModel.resourceWidget.addResource.data = null;
							});
				}
			}
		};
		
		viewModel.organizationWidget = {
			updateOrganization: function() {
				viewModel.organizationWidget.updateOrganization.processing = true;
				api.updateOrganization(organizationId, viewModel.organization)
					.then(function(response) {
						if (response && response.error) {
							alert('Something went wrong...');
						}	
						viewModel.organizationWidget.updateOrganization.processing = false;
					});
			},
			deleteOrganization: {
				dialog: function() {
					ngDialog.open({
						template: 'javascript/app/views/dialogs/deleteOrganization.html',
						className: 'ngdialog-theme-default',
						scope: $scope
					});
				},
				confirm: function() {
					api.deleteOrganization(organizationId)
						.then(function(response) {
							
							if (response && !response.error) {
								return $location.url('/');
							}
							alert('Something went wrong...');
						});
					ngDialog.close();
				}
			},
			addUserRole: {
				dialog: function() {
					ngDialog.open({
						template: 'javascript/app/views/dialogs/addUserRole.html',
						className: 'ngdialog-theme-default',
						scope: $scope
					});
				},
				submit: function() {
					viewModel.organizationWidget.addUserRole.processing = true;
					api.addRole(
						organizationId, 
						viewModel.organizationWidget.addUserRole.data)
							.then(function(response) {
								
								if (response && response.error) {
									alert('Something went wrong...');
								}
								viewModel.organizationWidget.addUserRole.processing = false;
							});
						ngDialog.close();
				}
			},
			updateUserRole: function(user) {
				console.log('update ' + user._user._id + ' to ' + user.role);
				viewModel.organizationWidget.updateUserRole.processing = true;
				api.updateRole(organizationId, {
					userId: user._user._id,
					role: user.role
				})
					.then(function(response) {
						if (response && response.error) {
							alert('Something went wrong...');
						}
						viewModel.organizationWidget.updateUserRole.processing = false;	
					});
			}
		};
	}
}());