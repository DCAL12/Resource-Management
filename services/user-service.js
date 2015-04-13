var bcrypt = require('bcrypt'),
	mongooseUtil = require('../util/mongoose-util'),
	User = require('../models/UserSchema').User;
	
var parseError = mongooseUtil.parseError;

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

		User.create(newUser, function(error) {
			if (error) {
				return next(parseError(error));
			}
			next();
		});
	});
};

exports.updateUser = function(user, update, next) {
	User
		.findById(user._id)
		.exec(function(error, userDocument) {
		if (error) {
			return next(error);
		}
		userDocument.firstName = update.firstName;
		userDocument.lastName = update.lastName;
		userDocument.email = update.email.toLowerCase();
		userDocument.defaultOrganization = update._defaultOrganization;

		userDocument.save(function(error) {
			if (error) {
				return next(parseError(error));
			}
			next(null, userDocument);
		});
	});
};

exports.changePassword = function(user, newPassword, next) {
	bcrypt.hash(newPassword, 10, function(error, hashedPassword) {
		if (error) {
			return next(error);
		}
		
		User.findOne({ email: user.email.toLowerCase() }, function(error, userDocument) {	
			if (error) {
				return next(error);
			}
			userDocument.password = hashedPassword;
			userDocument.save(function(error) {
				if (error) {
					return next(parseError(error));
				}
				next();
			});
		});
	});
};

exports.authenticate = function(email, next) {
	User
		.findOne({ email: email.toLowerCase().trim() })
		.select('_id email password')
		.exec(function(error, userCredentials) {
			next(error, userCredentials);
	});
};

exports.findById = function(userId, next) {
	User
		.findById(userId)
		.select('_id firstName lastName email _defaultOrganization createdOn')
		.exec(function(error, userInfo) {
			next(error, userInfo);
	});
};

exports.findByEmail = function(email, next) {
	User
		.findOne({ email: email.toLowerCase().trim() })
		.select('_id firstName lastName email _defaultOrganization createdOn')
		.exec(function(error, userInfo) {
			next(error, userInfo);
	});
};