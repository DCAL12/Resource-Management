var mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var resourceTypeSchema = new Schema({
	name: {
		type: String, 
		required: 'A unique name is required',
	},
	organization: {
		type: String,
		required: 'An existing organization is required'
	}
});

resourceTypeSchema.plugin(uniqueValidator, {
	message: 'A resource type with that name already exists in the organization'
});

var ResourceType = mongoose.model('ResourceType', resourceTypeSchema);

module.exports = { 
	ResourceType: ResourceType 
};