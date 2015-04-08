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

// exports.findOrganizationsByEmail = function (email, next) {
// 	Workspace.find({
// 		email: email.toLowerCase()
// 	}, function (error, user) {
// 		next(error, user);
// 	});
// };