var User = require('../models/UserSchema').User;

exports.addUser = function(user, next) {
	var newUser = {
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email.toLowerCase(),
		password: user.password
	};
	
	User.create(newUser, function (error) {
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

exports.checkIfUserExists = function (email, next) {
	User.findOne({ email: email.toLowerCase()}, function(error, user) {
		next(error, user);
	});
};