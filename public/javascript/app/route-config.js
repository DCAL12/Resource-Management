(function() {
	'use strict';

	angular
		.module('app')
		.config(config);
		
	// Protect injection parameter names from minification alteration
	config.$inject = ['$routeProvider'];

	function config($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: '/javascript/app/views/dashboard.html',
				controller: 'DashboardController',
				controllerAs: 'viewModel'
			})
			.when('/org/:organizationId', {
				templateUrl: '/javascript/app/views/organization.html',
				controller: 'OrganizationController',
				controllerAs: 'viewModel'
			});
	}
}());