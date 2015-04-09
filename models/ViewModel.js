var ViewModel = function(viewData, user, session) {
	var instance = Object.create(null);
	
	instance.title = viewData.title;
	instance.className = viewData.className ? viewData.className : viewData.title.toLowerCase();
	instance.user = user ? user : null;
	
	if (session && session.workspaces) {
		instance.workspaces = session.workspaces;	
	}
	
	instance.setStatus = function(status, message) {
		instance.status = status;
		instance.statusMessage = message;
	};
	
	instance.setFormInput = function(formInput) {
		instance.formInput = formInput;
	};
	
	return instance;
};

module.exports = ViewModel;