var Workspace = require('../models/WorkspaceSchema').Workspace,
	mongooseUtil = require('../util/mongoose-util');
	
var parseError = mongooseUtil.parseError;

exports.add = function (userId, organizationId, next) {
	Workspace.create({
		_user: userId,
		_organization: organizationId
		}, function (error, workspace) {
			if (error) {
				return next(parseError(error));
			}
			next();
	});
};

exports.getAllByUser = function (userId, next) {
	Workspace
		.find({_user: userId})
		.select('_organization')
		.populate('_organization', '_id name')
		.exec(function (error, results) {
			if (error) {
				next(error);
			}
			next(null, results);
	});
};