var Organization = require('../models/OrganizationSchema').Organization,
	Workspace = require('../models/WorkspaceSchema').Workspace,
	mongooseUtil = require('../util/mongoose-util');
	
var parseError = mongooseUtil.parseError;

exports.findAll = function(next) {
	// return error, null, or organizations
	Organization
		.find()
		.select('_id name')
		.exec(function (error, organizations) {
			next(error, organizations);
		});
};

exports.findByOrganizationId = function(organizationId, next) {
	// return error, null, or organization object
	Organization
		.findById(organizationId)
		.exec(function(error, organization) {
			next(error, organization);
	});	
};

exports.add = function(data, next) {
	Organization.create(data, function(error, organization) {
		if (error) {
			return next(parseError(error));
		}
		next(null, organization._id);
	});
};

exports.update = function(organizationId, update, next) {
	Organization
		.findByIdAndUpdate(organizationId, update)
		.exec(function(error) {
			if (error) {
				return next(parseError(error));
			}
			next();
		});	
};

exports.delete = function(organizationId, next) {
	Organization
		.findByIdAndRemove(organizationId)
		.exec(function(error) {
			if (error) {
				return next(parseError(error));
			}
			Workspace
				.remove({ _organization: organizationId },
				function(error) {
					if (error) {
						return next(parseError(error));
					}
					next();
				});
		});	
};