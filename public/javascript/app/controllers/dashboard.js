(function() {
	'use strict';
	
	angular
		.module('app')
		.controller('DashboardController', DashboardController);
	
	// Protect injection parameter names from minification alteration
	DashboardController.$inject = ['api', 'ngDialog', '$scope', '$location'];
	
	function DashboardController(api, ngDialog, $scope, $location) {
		var viewModel = this;
		
		api.getOrganizations()
			.then(function(response) {
				viewModel.organizations = response;
			});
			
		viewModel.createOrganization = {
			dialog: function() {
				ngDialog.open({
					template: 'javascript/app/views/dialogs/createOrganization.html',
					className: 'ngdialog-theme-default',
					scope: $scope
				});
			},
			submit: function() {
				viewModel.createOrganization.processing = true;
				api.addOrganization(viewModel.createOrganization.data)
					.then(function(response) {
						if (response && !response.error) {
							return $location.url('/org/' + response);
						}
						viewModel.createOrganization.processing = false;
						viewModel.createOrganization.data = null;
						alert('Something went wrong...');
					});
				ngDialog.close();
			}
		};
	}
}());