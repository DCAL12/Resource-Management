(function() {
	'use strict';
	
	angular
		.module('app')
		.factory('api', apiFactory);
		
	// Protect injection parameter names from minification alteration
	apiFactory.$inject = ['$http'];
	
	function apiFactory($http) {
		var apiPaths = {
			organizations: '/api/organizations/',
			workspaces: '/api/workspaces/',
			requests: '/api/requests/',
			resources: '/api/resources/',
			resourceTypes: '/api/resourceTypes/',
			attributes: '/api/resourceTypes/attributes/'
		};
		
		return {
			// Organization API
			getOrganizations: function() {
				return $http.get(apiPaths.organizations)
					.then(respond, giveReason)
					.catch(error);
			},
			getOrganizationDetails: function(organizationId) {
				return $http.get(apiPaths.organizations + organizationId)
					.then(respond, giveReason)
					.catch(error);
			},
			addOrganization: function(data) {
				return $http.post(apiPaths.organizations, data)
					.then(respond, giveReason)
					.catch(error);
			},
			updateOrganization: function(organizationId, data) {
				return $http.put(apiPaths.organizations + organizationId, data)
					.then(respond, giveReason)
					.catch(error);	
			},
			deleteOrganization: function(organizationId) {
				return $http.delete(apiPaths.organizations + organizationId)
					.then(respond, giveReason)
					.catch(error);	
			},
			
			// User Role API
			getRole: function(organizationId) {
				return $http.get(apiPaths.workspaces + organizationId + '/role')	
					.then(respond, giveReason)
					.catch(error);
			},
			getAllRoles: function(organizationId) {
				return $http.get(apiPaths.workspaces + organizationId)
					.then(respond, giveReason)
					.catch(error);
			},
			addRole: function(organizationId, data) {
				return $http.post(apiPaths.workspaces + organizationId, data)
					.then(respond, giveReason)
					.catch(error);
			},
			updateRole: function(organizationId, data) {
				return $http.put(apiPaths.workspaces + organizationId, data)
					.then(respond, giveReason)
					.catch(error);
			},
			
			// Request API
			getRequests: function(organizationId) {
				return $http.get(apiPaths.requests + organizationId)
					.then(respond, giveReason)
					.catch(error);
			},
			getRequest: function(organizationId, requestId) {
				return $http.get(apiPaths.requests 
					+ organizationId
					+'/'
					+ requestId)
						.then(respond, giveReason)
						.catch(error);
			},
			addRequest: function(organizationId, data) {
				return $http.post(apiPaths.requests + organizationId, data)
					.then(respond, giveReason)
					.catch(error);
			},
			updateRequest: function(organizationId, requestId, data) {
				return $http.put(apiPaths.requests 
					+ organizationId 
					+ '/' 
					+ requestId, data)
						.then(respond, giveReason)
						.catch(error);	
			},
			deleteRequest: function(organizationId) {
				return $http.delete(apiPaths.requests + organizationId)
					.then(respond, giveReason)
					.catch(error);		
			},
			
			// Resource API
			getResources: function(organizationId, resourceTypeId) {
				return $http.get(apiPaths.resources 
					+ organizationId 
					+ '/' 
					+ resourceTypeId)
						.then(respond, giveReason)
						.catch(error);
			},
			addResource: function(organizationId, resourceTypeId, data) {
				return $http.post(apiPaths.resources 
					+ organizationId 
					+ '/' 
					+ resourceTypeId, 
					data)
						.then(respond, giveReason)
						.catch(error);	
			},
			updateResource: function(organizationId, resourceTypeId, resourceId, data) {
				return $http.put(apiPaths.resources 
					+ organizationId 
					+ '/' 
					+ resourceTypeId
					+'/'
					+ resourceId, 
					data)
						.then(respond, giveReason)
						.catch(error);	
			},
			deleteResource: function(organizationId, resourceTypeId, resourceId) {
				return $http.delete(apiPaths.resources
					+ organizationId 
					+ '/' 
					+ resourceTypeId
					+'/'
					+ resourceId)
						.then(respond, giveReason)
						.catch(error);	
			},
			
			// Resource Type API
			getResourceTypes: function(organizationId) {
				return $http.get(apiPaths.resourceTypes + organizationId)
					.then(respond, giveReason)
					.catch(error);
			},
			getResourceTypeByID: function(organizationId, resourceTypeId) {
				return $http.get(apiPaths.resourceTypes
					+ organizationId
					+ '/'
					+ resourceTypeId)
						.then(respond, giveReason)
						.catch(error);
			},
			addResourceType: function(organizationId, data) {
				return $http.post(apiPaths.resourceTypes + organizationId, data)
					.then(respond, giveReason)
					.catch(error);	
			},
			updateResourceType: function(organizationId, resourceTypeId, data) {
				return $http.put(apiPaths.resourceTypes 
					+ organizationId 
					+ '/' 
					+ resourceTypeId, data)
						.then(respond, giveReason)
						.catch(error);	
			},
			addResourceTypeAttribute: function(resourceTypeId, attribute) {
				return $http.put(apiPaths.attributes + resourceTypeId, attribute)
					.then(respond, giveReason)
					.catch(error);
			},
			deleteResourceType: function(organizationId) {
				return $http.delete(apiPaths.resourceTypes + organizationId)
					.then(respond, giveReason)
					.catch(error);	
			},
			deleteResourceTypeAttribute: function(resourceTypeId, attributeId) {
				return $http.delete(apiPaths.attributes 
					+ resourceTypeId 
					+ '/'
					+ attributeId)
						.then(respond, giveReason)
						.catch(error);	
			}
		};
	}
	
	function respond(response) {
		return response.data;
	}
	
	function giveReason(reason) {
		console.log(reason);
	}
	
	function error(error) {
		console.log(error);
	}
}());