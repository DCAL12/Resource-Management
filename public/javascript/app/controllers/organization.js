(function() {
	'use strict';
	
	angular
		.module('app')
		.controller('OrganizationController', OrganizationController);
	
	// Protect injection parameter names from minification alteration
	OrganizationController.$inject = ['api', '$routeParams', 'ngDialog'];
	
	function OrganizationController(api, $routeParams, ngDialog, $scope) {
		var viewModel = this;
		
		api.getOrganizationDetails($routeParams.organizationId)
			.then(function(data) {
				viewModel.organization = data;
			});
		
		
			
		// api.getResourceTypes($routeParams.organizationId)
		// 	.then(function(data) {
		// 		viewModel.resourceTypes = data;
		// 	});
	}
}());