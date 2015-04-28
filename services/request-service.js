var Request = require('../models/RequestSchema').Request,
	mongooseUtil = require('../util/mongoose-util');
	
var parseError = mongooseUtil.parseError;

exports.getAllByOrganizationId = function(organizationId, next) {
	Request
		.find({ _organization: organizationId })
		.exec(function (error, requests) {
			if (error) {
				return next(parseError(error));
			}
			next(null, requests);
	});
};

exports.add = function(organizationId, data, next) {
	Request.create(data, function (error) {
		if (error) {
			return next(parseError(error));
		}
		next(null);
	});
};

exports.update = function(requestId, data, next) {
	Request
		.findByIdAndUpdate(requestId, { $set: {
			description: data.description,
			startTime: data.startTime,
			endTime: data.endTime,
			location: data.location
		}})
		.exec(function(error) {
			if (error) {
				return next(parseError(error));
			}
			next();
		});	
};

exports.delete = function(requestId, next) {
	Request
		.findByIdAndRemove(requestId)
		.exec(function(error) {
			if (error) {
				return next(parseError(error));
			}
			next();
		});	
};

