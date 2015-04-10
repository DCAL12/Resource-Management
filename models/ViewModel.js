var ViewModel = function(viewObject, user, session, workspaces) {
	var instance = Object.create(null);
	
	instance.title = viewObject.title;
	instance.className = viewObject.className ? viewObject.className : viewObject.title.toLowerCase();
	instance.user = user ? user : null;
	
	if (session && user) {
		// set instance from session or update session from user and workspaces
		if (session.workspaces) {
			instance.workspaces = session.workspaces;	
		}
		else {
			instance.workspaces = workspaces ? workspaces : null;
			session.workspaces = workspaces ? workspaces : null;
		}
		
		if (session.currentWorkspace) {
        	instance.currentWorkspace = session.currentWorkspace;    
    	}
    	
	    else {
	        instance.currentWorkspace = user.defaultOrganization ? user.defaultOrganization : null;
	        session.currentWorkspace = user.defaultOrganization ? user.defaultOrganization : null;
	    }
	}
	
	instance.setStatus = function(status, message) {
		instance.status = status;
		instance.statusMessage = message;
	};
	
	return instance;
};

module.exports = ViewModel;