var mongoose = require('mongoose'),
	schemaGenerator = require('mongoose-gen'),
	AttributeSchema = require('./AttributeSchema'),
	Organization = require('./OrganizationSchema').Organization;

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
	attributes: [AttributeSchema],
	
	collectionName: {
		type: String
	}
});

// Set the corresponding resource collection name
resourceTypeSchema.statics.createWithCollectionName = function(resourceType, next) {
	Organization
		.findById(resourceType._organization)
		.exec(function(error, organization) {
		if (error) {
			return next(error);
		}
		resourceType.collectionName = 
			(organization.name 
			+ '_' 
			+ resourceType.type)
			.toLocaleLowerCase();
			
		ResourceType.create(resourceType, function (error, resourceType) {
			
			if (error) {
				return next(error);
			}
			// Set a default 'id' attribute	
			resourceType.attributes.push({
				name: 'id',
				type: 'Number',
				unique: true,
				required: true
			});
			resourceType.save(function(error) {
				if (error) {
					return next(error);
				}
				next(null, resourceType._id);
			});
		});
	});	
};

// Get the model (virtual)
resourceTypeSchema.virtual('getModel').get(function() {
	var thisDocument = this;

	// Return the existing model if it's already been created
	if (Object
			.keys(mongoose.connection.models)
			.some(function(model) {
				return model === thisDocument.collectionName;
		})) {
		return mongoose.connection.model(thisDocument.collectionName);		
	}
	
	return createModel(thisDocument);
});

resourceTypeSchema.statics.updateModel = function(resourceType) {
	
	delete mongoose.connection.models[resourceType.collectionName];
	createModel(resourceType);
};

function createModel(document) {
	var newSchema = new Schema(schemaGenerator
		.convert(document.jsonAttributes));
	
	return mongoose.model(document.collectionName, newSchema);	
}

// Helper for schemaGenerator
resourceTypeSchema.virtual('jsonAttributes').get(function(next) {
	var thisDocument = this,
		attributesJSON = {};
	
	thisDocument.attributes.forEach(function(attribute) {
		attributesJSON[attribute.name] = {
			type: attribute.type,
			unique: attribute.unique,
			required: attribute.required
		};
	});
	
	return attributesJSON;
});

var ResourceType = mongoose.model('ResourceType', resourceTypeSchema);

module.exports = { 
	ResourceType: ResourceType 
};