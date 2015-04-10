// Application modules
var Organization = require('../models/OrganizationSchema').Organization,
	resourceTypeService = require('./resourceType-service'),
	resourceService = require('./resource-service'),
	requestService = require('./request-service');

exports.addOrganization = function (organization, next) {
	var newOrganization = {
			name: organization.organizationName.toLowerCase(),
			createdBy: organization.createdBy.toLowerCase()
		};
	Organization.create(newOrganization, function (error) {
		if (error) {
			return next(error.toString()
				.substring(
					error.toString()
					.indexOf(':') + 2
				));
		}
		next(null, newOrganization);
	});
};

exports.getOrganizations = function (next) {
	Organization.find(null, function (error, organizations) {
		next(error, organizations);
	});
};

exports.findOrganizationByName = function (name, next) {
	Organization.findOne({
		name: name.toLowerCase()
	}, function (error, organization) {
		next(error, organization);
	});
};

exports.getOrganizationInfo = function(organization, options, next) {
	var organizationInfo = {},
		errorMessage = null;
	
	// Get resource types 
	if (options.resourceTypes) {
		resourceTypeService.getResourceTypesByOrganization(organization, function(error, resourceTypes) {
			if (error) {
				errorMessage = error;
			}
			else {
				organizationInfo.resourceTypes = resourceTypes;	
			}
		});
	}
	
	// Get Resources
	if (options.resources) {
		resourceService.getResourcesByOrganization(organization, function(error, resources) {
			if (error) {
				errorMessage = null ? error : errorMessage + error;
			}
			else {
				organizationInfo.resources = resources;	
			}
		});	
	}
	
	// Get Requests
	if (options.requests) {
		requestService.getRequestsByOrganization(organization, function(error, requests) {
			if (error) {
				errorMessage = null ? error : errorMessage + error;
			}
			else {
				organizationInfo.requests = requests;	
			}
		});	
	}
	
	next(errorMessage, organizationInfo);	
};