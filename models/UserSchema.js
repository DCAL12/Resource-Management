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

userSchema.path('email').validate(function(value, next) {
	userService.checkIfUserExists(value, function(error, user) {
		if (error) {
			console.log(error);
			return next(false);
		}
		next(!user)
	});
}, 'That user already exists');

var User = mongoose.model('User', userSchema);

module.exports = { 
	User: User 
};