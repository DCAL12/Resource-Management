var Organization = require('../models/OrganizationSchema').Organization,
	mongooseUtil = require('../util/mongoose-util');
	
var parseError = mongooseUtil.parseError;

exports.findAll = function(next) {
	// return error, null, or organizations
	Organization
		.find()
		.select('_id name')
		.exec(function (error, results) {
			next(error, results);
		});
};

exports.findById = function(organizationId, next) {
	// return error, null, or organization object
	Organization
		.findById(organizationId)
		.exec(function(error, result) {
			next(error, result);
	});	
};

// CONSIDER REMOVING

// exports.findByName = function(name, next) {
// 	// return error, null, or organizationId
// 	Organization
// 		.findOne({ name: name.toLowerCase().trim()}, '_id name')
// 		.exec(function (error, result) {
// 			next(error, result);
// 		});
// };

exports.add = function(request, next) {
	Organization.create(request, function(error, organization) {
		if (error) {
			return next(parseError(error));
		}
		next(null, organization._id);
	});
};