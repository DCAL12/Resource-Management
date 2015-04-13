// Core/NPM Dependencies
var bcrypt = require('bcrypt');

module.exports = function() {
	var passport = require('passport'),
		LocalStrategy = require('passport-local').Strategy,
		userService = require('../services/user-service');
	
	passport.use(new LocalStrategy({
		usernameField: 'email'
		}, function(loginUserName, loginPassword, next) {
			userService.authenticate(loginUserName, function(error, userCredentials) {
				if (error) {
					return next(error);
				}	
				if (!userCredentials) {
					return next();
				}
				bcrypt.compare(loginPassword, userCredentials.password, function(error, isMatched) {
					if (error) {
						return next(error);
					}
					
					if (!isMatched) {
						return next();
					}
					console.log('authenticated: ' + userCredentials._id);
					return next(null, userCredentials); // user is authenticated
				});
			});
	}));
	
	passport.serializeUser(function(user, next) {
		// write the userId to the session
		next(null, user._id);
	});
	
	passport.deserializeUser(function(userId, next) {
		// get properties of the current user
		userService.findById(userId, function(error, userInfo) {
			next(error, userInfo);
		});
	});
};