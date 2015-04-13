var mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

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
		required: 'Email is required',
		unique: true,
		lowercase: true,
		trim: true
	},
	password: {
		type: String, 
		required: 'Password is required'
	},
	_defaultOrganization: {
		type: ObjectId,
		ref: 'Organization',	
	},
	createdOn: {
		type: Date, 
		default: Date.now
	}
});

userSchema.plugin(uniqueValidator, {
	message: 'That user already exists. Choose a different {PATH}.'
});

var User = mongoose.model('User', userSchema);

module.exports = { 
	User: User 
};