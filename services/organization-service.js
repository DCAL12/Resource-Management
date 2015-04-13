var Organization = require('../models/OrganizationSchema').Organization,
	mongooseUtil = require('../util/mongoose-util');
	
var parseError = mongooseUtil.parseError;

exports.add = function(organizationObject, next) {
	Organization.create(organizationObject, function(error, organization) {
		if (error) {
			return next(parseError(error));
		}
		next(null, organization);
	});
};

exports.findById = function(organizationId, next) {
	// return error, null, or organization object
	Organization
		.findById(organizationId, '_id name')
		.exec(function(error, result) {
			next(error, result);
	});	
};

exports.findByName = function(name, next) {
	// return error, null, or organizationId
	Organization
		.findOne({ name: name.toLowerCase().trim()}, '_id name')
		.exec(function (error, result) {
			next(error, result);
		});
};

exports.findAll = function(next) {
	// return error, null, or organizations
	Organization
		.find()
		.select('name')
		.exec(function (error, results) {
			next(error, results);
		});
};