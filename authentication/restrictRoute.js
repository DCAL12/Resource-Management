module.exports = function (request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	}
	response.status(401).redirect('/users/login');
};