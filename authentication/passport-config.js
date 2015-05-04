// Core/NPM Dependencies
var bcrypt = require('bcrypt'),
	workspaceService = require('../services/workspace-service');

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
			if (error) {
				return next(error);
			}
			// Join the user's available workspaces
			workspaceService.getAllByUser(userId, 
				function(error, workspaces) {
		    		if (error || !workspaces.length > 0) {
		        		return next(error, userInfo);
		       		}
		       		userInfo.workspaces = workspaces;
      				return next(null, userInfo);
			});
		});
	});
};