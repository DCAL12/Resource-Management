(function() {
	'use strict';
	
	angular
		.module('app')
		.controller('OrganizationController', OrganizationController);
	
	// Protect injection parameter names from minification alteration
	OrganizationController.$inject = ['api', '$routeParams'];
	
	function OrganizationController(api, $routeParams) {
		var viewModel = this;
		
		api.getOrganizationDetails($routeParams.organizationId)
			.then(function(data) {
				viewModel.organization = data;
			});
	}
}());