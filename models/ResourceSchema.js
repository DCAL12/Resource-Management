var mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var resourceSchema = new Schema({
	name: {
		type: String, 
		required: 'A unique name is required',
	},
	resourceType: {
		type: String,
		required: 'An existing resource type is required'
	},
	organization: {
		type: String,
		required: 'An existing organization is required'
	},
	status: {
		type: String
	}
});

resourceSchema.plugin(uniqueValidator, {
	message: 'A resource with that name and type already exists in the organization'
});

var Resource = mongoose.model('Resource', resourceSchema);

module.exports = { 
	Resource: Resource 
};