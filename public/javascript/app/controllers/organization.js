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
				if (resourceTypes.length > 0) {
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
					api.addRequest(organizationId,
						viewModel.requestWidget.createRequest.data)
							.then(function(response) {
								if (response && response.error) {
									alert('Something went wrong...');
								}
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
					api.addResourceType(organizationId, 
						viewModel.resourceWidget.createResourceType.data)
							.then(function(response) {
								if (response && response.error) {
									alert('Something went wrong...');
								}
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
					api.addResourceTypeAttribute(
						viewModel.resourceTypes.selected._id, 
						viewModel.resourceWidget.addAttribute.data)
							.then(function(response) {
								if (response && response.error) {
									alert('Something went wrong...');
								}
							});
							ngDialog.close();
				}
			},
			addResource: {
				submit: function() {
					api.addResource(organizationId, 
						viewModel.resourceTypes.selected._id, 
						viewModel.resourceWidget.addResource.data)
							.then(function(response) {
								if (response && response.error) {
									alert('Something went wrong...');
								}
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