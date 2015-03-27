// Core/NPM Dependencies
var bcrypt = require('bcrypt');

// Application modules
var User = require('../models/UserSchema').User;

exports.addUser = function(user, next) {
	bcrypt.hash(user.password, 10, function(error, hashedPassword) {
		if (error) {
			return next(error);
		}
		var newUser = {
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email.toLowerCase(),
			password: hashedPassword
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
	});
};

exports.findUserByEmail = function (email, next) {
	User.findOne({ email: email.toLowerCase()}, function(error, user) {
		next(error, user);
	});
};