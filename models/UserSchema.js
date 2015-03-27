var mongoose = require('mongoose');

var userService = require('../services/user-service');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	firstName: {
		type: String, 
		required: 'First name is required'
	},
	lastName: {
		type: String, 
		required: 'Last name is required'
	},
	email: {
		type: String, 
		required: 'Email is required'
	},
	password: {
		type: String, 
		required: 'Password is required'
	},
	createdOn: {
		type: Date, 
		default: Date.now
	}
});

// Ensure the user doesn't already exist
userSchema.path('email').validate(function(email, next) {
	userService.findUserByEmail(email, function(error, user) {
		if (error) {
			// user already exists in the database
			return next(false);
		}
		next(!user); // return true if the user doesn't exist yet
	});
}, 'That user already exists');

var User = mongoose.model('User', userSchema);

module.exports = { 
	User: User 
};