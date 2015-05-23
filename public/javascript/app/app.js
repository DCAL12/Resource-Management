(function() {
	'use strict';

	angular
		.module('app', ['ngRoute', 'ngDialog'])
		.config(['$routeProvider', function($routeProvider) {
			$routeProvider.otherwise({redirectTo:'/'});
		}])
		.config(['ngDialogProvider', function (ngDialogProvider) {
		    ngDialogProvider.setDefaults({
		        className: 'ngdialog-theme-default',
		        showClose: true,
		        closeByDocument: true,
		        closeByEscape: true
		    });
		}]);	
}());
	

