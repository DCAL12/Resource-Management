// Core/NPM Dependencies
var bcrypt = require('bcrypt');

module.exports = function() {
	var passport = require('passport');
	var passport_local = require('passport-local');
	var userService = require('../services/user-service');
	var config = require('../config');
	
	passport.use(new passport_local.Strategy({
			usernameField: config.locals.usernameField
		}, function(email, password, next) {
			userService.findUserByEmail(email, function(error, user) {
				if (error) {
					return next(error);
				}	
				if (!user) {
					return next(null, null);
				}
				bcrypt.compare(password, user.password, function(error, isMatched) {
					if (error) {
						return next(error);
					}
					
					if (!isMatched) {
						return next(null, null);
					}
					
					return next(null, user); // user is authenticated
				});
			});
	}));
	
	passport.serializeUser(function(authenticatedUser, next) {
		// write the userName to the session
		next(null, authenticatedUser.email);
	});
	
	passport.deserializeUser(function(userName, next) {
		// get properties of the current user
		userService.findUserByEmail(userName, function(error, authenticatedUser) {
			next(error, authenticatedUser);
		});
	});
};