var Workspace = require('../models/WorkspaceSchema').Workspace,
	mongooseUtil = require('../util/mongoose-util');
	
var parseError = mongooseUtil.parseError;

exports.add = function(userId, organizationId, role, next) {
	Workspace.create({
		_user: userId,
		_organization: organizationId, 
		role: role
		}, function(error, workspace) {
			
			if (error) {
				return next(parseError(error));
			}
			next(null, workspace._id);
	});
};

exports.getAllByUser = function(userId, next) {
	Workspace
		.find({_user: userId})
		.select('_organization')
		.populate('_organization', '_id name')
		.exec(function(error, workspaces) {
			
			if (error) {
				next(parseError(error));
			}
			next(null, workspaces);
	});
};

exports.getAllByOrganization = function(organizationId, next) {
	Workspace
		.find({_organization: organizationId})
		.select('_user role')
		.populate('_user', '_id firstName lastName email')
		.exec(function(error, workspaces) {
			
			if (error) {
				next(parseError(error));
			}	
			next(null, workspaces);
		});
};

exports.getRole = function(organizationId, userId, next) {
	Workspace
		.findOne({
			_organization: organizationId,
			_user: userId
		})
		.select('role')
		.exec(function(error, role) {
			
			if (error) {
				next(parseError(error));
			}
			next(null, role);
		});
};