(function() {
	'use strict';
	
	angular
		.module('app')
		.controller('OrganizationController', OrganizationController);
	
	// Protect injection parameter names from minification alteration
	OrganizationController.$inject = ['$routeParams', 'api', 'ngDialog', '$scope', '$location'];
	
	function OrganizationController($routeParams, api, ngDialog, $scope, $location) {
		var viewModel = this;
		
		api.getOrganizationDetails($routeParams.organizationId)
			.then(function(data) {
				viewModel.organization = data;
			});
			
		api.getResourceTypes($routeParams.organizationId)
			.then(function(data) {
				viewModel.resourceTypes = data;
			});
			
		api.getRequests($routeParams.organizationId)
			.then(function(data) {
				viewModel.requests = data;
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
					api.addRequest($routeParams.organizationId,
						viewModel.requestWidget.createRequest.data)
							.then(function(response) {
								if (response && response.error) {
									alert('Something went wrong...');
								}
							});
					ngDialog.close();
				}
			}	
		};
			
		viewModel.resourceWidget = {
			createResourceType: {
				dialog: function() {
					ngDialog.open({
						template: 'javascript/app/views/dialogs/createResourceType.html',
						className: 'ngdialog-theme-default',
						scope: $scope
					});
				},
				submit: function() {
					api.addResourceType($routeParams.organizationId, 
						viewModel.resourceWidget.createResourceType.data)
							.then(function(response) {
								if (response && response.error) {
									alert('Something went wrong...');
								}
							});
					ngDialog.close();
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
					api.deleteOrganization($routeParams.organizationId)
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