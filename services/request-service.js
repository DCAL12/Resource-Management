var Request = require('../models/RequestSchema').Request,
	mongooseUtil = require('../util/mongoose-util');
	
var parseError = mongooseUtil.parseError;

exports.add = function (request, next) {
	Request.create(request, function (error) {
		if (error) {
			return next(parseError(error));
		}
		next(null);
	});
};

exports.getAllByOrganizationId = function (organizationId, next) {
	// return error, null, or request array
	Request.find({
		organization: organizationId
	}, function (error, results) {
		if (error) {
			next(error, null);
		}
		next(null, results);
	});
};