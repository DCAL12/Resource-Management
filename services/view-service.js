var	workspaceService = require('../services/workspace-service');

exports.addUserInfo = function(user, viewObject, next) {
	viewObject.user = user;
	workspaceService.getAllByUser(user._id, 
		function(error, organizationNames) {
	    	if (error || !organizationNames.length > 0) {
	        	return next(viewObject);
	       }
	       	viewObject.workspaces = organizationNames;
      		next(viewObject);
	});	
};