(function() {
	'use strict';
	
	angular
		.module('app')
		.controller('DashboardController', DashboardController);
	
	// Protect injection parameter names from minification alteration
	DashboardController.$inject = ['api'];
	
	function DashboardController(api) {
		var viewModel = this;
		
		api.getOrganizations()
			.then(function(data) {
				viewModel.organizations = data;
			});
	}
}());