// Application modules
var Organization = require('../models/OrganizationSchema').Organization;

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