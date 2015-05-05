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
		
		viewModel.deleteOrganization = {
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
		};
			
		// api.getResourceTypes($routeParams.organizationId)
		// 	.then(function(data) {
		// 		viewModel.resourceTypes = data;
		// 	});
	}
}());