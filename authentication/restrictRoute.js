module.exports = function (request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	}
	response.redirect('/users');
};