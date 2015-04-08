// Application modules
var Request = require('../models/RequestSchema').Request;

exports.addRequest = function (request, next) {
	Request.create(request, function (error) {
		if (error) {
			return next(error.toString()
				.substring(
					error.toString()
					.indexOf(':') + 2
				));
		}
		next(null);
	});
};