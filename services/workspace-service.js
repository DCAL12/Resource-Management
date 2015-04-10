
var Workspace = require('../models/WorkspaceSchema').Workspace;

exports.addWorkspace = function (user, organization, next) {
	var newWorkspace = {
			userName: user.email.toLowerCase(),
			organization: organization.name.toLowerCase()
		};
	Workspace.create(newWorkspace, function (error) {
		if (error) {
			return next(error.toString()
				.substring(
					error.toString()
					.indexOf(':') + 2
				));
		}
		next(null, newWorkspace);
	});
};

exports.getUserWorkspaces = function (user, next) {
	Workspace.find({
		userName: user.email.toLowerCase()
	}, function (error, workspaces) {
		if (error) {
			next(error, null);
		}
		next(null, workspaces);
	});
};