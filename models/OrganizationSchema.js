var mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var organizationSchema = new Schema({
	name: {
		type: String, 
		required: 'A unique organization name is required',
		unique: true,
		lowercase: true,
		trim: true
	},
	settings: {
		defaultAccess: {
			type: String,
			lowercase: true,
			trim: true,
			enum: ['guest', 'viewer', 'requestor', 'manager', 'owner'],
			default: 'guest'
		}	
	},
	createdBy: {
		type: String,
		lowercase: true,
		trim: true
	},
	createdOn: {
		type: Date, 
		default: Date.now
	}
});

organizationSchema.plugin(uniqueValidator, {
	message: 'That organization name already exists.'
});

var Organization = mongoose.model('Organization', organizationSchema);

module.exports = { 
	Organization: Organization 
};