var bcrypt = require('bcrypt'),
	mongooseUtil = require('../util/mongoose-util'),
	User = require('../models/UserSchema').User;
	
var parseError = mongooseUtil.parseError;

exports.findById = function(userId, next) {
	User
		.findById(userId)
		.select('_id firstName lastName email _defaultOrganization createdOn')
		.exec(function(error, userInfo) {
			if (error) {
				return next(parseError(error));
			}
			next(userInfo);
	});
};

exports.findByEmail = function(email, next) {
	User
		.findOne({ email: email.toLowerCase().trim() })
		.select('_id firstName lastName email _defaultOrganization createdOn')
		.exec(function(error, userInfo) {
			if (error) {
				return next(parseError(error));
			}
			next(userInfo);
	});
};

exports.add = function(user, next) {
	bcrypt.hash(user.password, 10, function(error, hashedPassword) {
		if (error) {
			return next(parseError(error));
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

exports.update = function(user, update, next) {
	User
		.findByIdAndUpdate(user._id, { $set: {
			firstName: update.firstName,
			lastName: update.lastName,
			email: update.email.toLowerCase(),
			defaultOrganization: update._defaultOrganization
		}})
		.exec(function(error, userDocument) {
			if (error) {
				return next(parseError(error));
			}
			next(null, userDocument);
		});
};

exports.changePassword = function(user, newPassword, next) {
	bcrypt.hash(newPassword, 10, function(error, hashedPassword) {
		if (error) {
			return next(parseError(error));
		}
		
		User
			.findOne({ email: user.email.toLowerCase() })
			.exec(function(error, userDocument) {	
				if (error) {
					return next(parseError(error));
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
			if (error) {
				return next(parseError(error));
			}
			next(userCredentials);
	});
};