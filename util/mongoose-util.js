exports.parseError = function(error) {
	return error.toString()
					.substring(error.toString()
							.indexOf(':') + 2); 	
};