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
		
		api.getRequests(organizationId)
			.then(function(data) {
				viewModel.requests = data;
			});
			
		api.getResourceTypes(organizationId)
			.then(function(resourceTypes) {
				
				if (resourceTypes && resourceTypes.length > 0) {
					viewModel.resourceTypes = resourceTypes;
					viewModel.resourceTypes.selected = resourceTypes[0];
					viewModel.resourceWidget.selectType(viewModel.resourceTypes.selected);	
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
					
					var newRequest = viewModel.requestWidget.createRequest.data;
					
					viewModel.requestWidget.createRequest.processing = true;
					api.addRequest(organizationId, newRequest)
						.then(function(response) {
							
							if (response && response.error) {
								alert('Something went wrong...');
							}
							else {
								// temporary placeholder; will be filled in by 
								// with real data on next refresh
								newRequest._createdBy = {};
								newRequest._createdBy.email = 'me';
								newRequest.createdTime = 'just now';
								viewModel.requests.push(viewModel.requestWidget.createRequest.data);	
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
			}
		};
			
		viewModel.resourceWidget = {
			selectType: function(resourceType) {
				
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
								viewModel.resourceTypes.selected = viewModel.resourceWidget.createResourceType.data;
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
			}	
		};
	}
}());