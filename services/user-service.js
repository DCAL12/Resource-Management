// Core/NPM Dependencies
var bcrypt = require('bcrypt');

// Application modules
var User = require('../models/UserSchema').User;

exports.addUser = function (user, next) {
	bcrypt.hash(user.password, 10, function (error, hashedPassword) {
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

exports.updateUser = function (user, update, next) {
	User.findOne({
		email: user.email.toLowerCase()
	}, function (error, userDocument) {
		if (error) {
			return next(error);
		}
		userDocument.firstName = update.firstName;
		userDocument.lastName = update.lastName;
		userDocument.email = update.email.toLowerCase();
		userDocument.defaultOrganization = update.defaultOrganization.toLowerCase();

		userDocument.save(function (error) {
			if (error) {
				next(error, null);
			}
			next(null, userDocument);
		});
	});
};

exports.changePassword = function (user, newPassword, next) {
	bcrypt.hash(newPassword, 10, function (error, hashedPassword) {
		if (error) {
			return next(error);
		}
		
		User.findOne({ email: user.email.toLowerCase() }, function (error, userDocument) {	
			if (error) {
				return next(error);
			}
			userDocument.password = hashedPassword;
			userDocument.save(function (error) {
				if (error) {
					next(error);
				}
				next();
			});
		});
	});
};

exports.findUserByEmail = function (email, next) {
	User.findOne({
		email: email.toLowerCase()
	}, function (error, user) {
		next(error, user);
	});
};