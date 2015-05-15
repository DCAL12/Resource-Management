var ResourceType = require('../models/ResourceTypeSchema').ResourceType,
	AttributeSchema = require('../models/AttributeSchema'),
	mongooseUtil = require('../util/mongoose-util');
	
var parseError = mongooseUtil.parseError;	

exports.getAllByOrganizationId = function(organizationId, next) {
	ResourceType
		.find({ _organization: organizationId })
		.exec(function (error, resourceTypes) {
			if (error) {
				return next(parseError(error));
			}
			next(null, resourceTypes);
		});
};

exports.add = function(data, next) {
	ResourceType.createWithCollectionName(data, function (error, resourceTypeId) {
		if (error) {
			return next(parseError(error));
		}
		next(null, resourceTypeId);
	});
};

exports.update = function(resourceTypeId, data, next) {
	ResourceType
		.findByIdAndUpdate(resourceTypeId, { $set: data})
		.exec(function(error) {
			if (error) {
				return next(parseError(error));
			}
			next();
		});
};

exports.delete = function(resourceTypeId, next) {
	ResourceType
		.findByIdAndRemove(resourceTypeId)
		.exec(function(error) {
			if (error) {
				return next(parseError(error));
			}
			next();
		});	
};

exports.attributeService = {
	add: function(resourceTypeId, attribute, next) {
		ResourceType
			.findById(resourceTypeId)
			.exec(function(error, resourceType) {
				if (error) {
					return next(parseError(error));
				}
				resourceType.attributes.push(attribute);
				resourceType.save(function(error) {
					var attributeId = null;
					
					if (error) {
						return next(parseError(error));
					}
					attributeId = resourceType.attributes[resourceType
						.attributes.length - 1]._id;
					next(null, attributeId);
				});
			});			
	}, 
	delete: function(resourceTypeId, attributeId, next) {
		ResourceType
			.findById(resourceTypeId)
			.exec(function(error, resourceType) {
				if (error) {
					return next(parseError(error));
				}
				
				resourceType.attributes.id(attributeId).remove();
				resourceType.save(function(error) {
					if (error) {
						return next(parseError(error));
					}
					next();
				});
			});		
	}       
};