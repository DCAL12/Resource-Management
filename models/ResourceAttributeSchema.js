var mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var resourceAttributeSchema = new Schema({
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
	}
});

resourceAttributeSchema.plugin(uniqueValidator, {
	message: 'An attribute with that name already exists'
});

var ResourceAttribute = mongoose.model('ResourceAttribute', resourceAttributeSchema);

module.exports = { 
	ResourceAttribute: ResourceAttribute
};