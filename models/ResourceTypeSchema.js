var mongoose = require('mongoose'),
	schemaGenerator = require('mongoose-gen'),
	Attribute = require('./AttributeSchema'),
	resourceTypeService = require('../services/resourceType-service'),
	uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var resourceTypeSchema = new Schema({
	_organization: {
		type: ObjectId,
		ref: 'Organization',
		required: 'An existing organization is required'
	},
	type: {
		type: String, 
		required: 'A unique type name is required',
	},
	attributes: [Attribute],
	
	model: {}
});

resourceTypeSchema.plugin(uniqueValidator, {
	message: 'A resource type with that name already exists in the organization'
});

// Generate the model and add to document 
resourceTypeSchema.pre('init', function(next) {
	var newSchema = new Schema(schemaGenerator.convert(this.attributes));
	if (!newSchema) {
		return next('Invalid schema definition');
	}
	
	resourceTypeService.generateCollectionName(this, function(error, collectionName) {
		if(error) {
			return next(error);
		}
		mongoose.model(collectionName, newSchema, function(error, model) {
			if(error) {
				return next(error);
			}
			this.model = model;
		});
	});
});

var ResourceType = mongoose.model('ResourceType', resourceTypeSchema);

module.exports = { 
	ResourceType: ResourceType 
};