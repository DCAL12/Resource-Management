var mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var organizationSchema = new Schema({
	name: {
		type: String, 
		required: 'A unique organization name is required',
		unique: true,
		lowercase: true,
		trim: true
	},
	description: {
		type: String,
		required: 'A brief description is required'
	},
	settings: {
		defaultAccess: {
			type: String,
			lowercase: true,
			trim: true,
			enum: ['none', 'viewer', 'requestor', 'manager', 'owner'],
			default: 'viewer'
		}	
	},
	_createdBy: {
		type: ObjectId,
		ref: 'User',
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