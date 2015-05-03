var ResourceType = require('../models/ResourceTypeSchema').ResourceType,
	mongooseUtil = require('../util/mongoose-util');
	
var parseError = mongooseUtil.parseError;

exports.getAllByOrganizationId = function(organizationId, next) {
	ResourceType
		.find({ _organization: organizationId })
		.exec(function(error, resourceTypes) {
			var collections = [];
			
			if (error) {
				return next(parseError(error));
			}
			
			resourceTypes.forEach(function(resourceType) {
				var Resource = resourceType.model;
				Resource.findAll(function(error, documents) {
					if(error) {
						return next(parseError(error));
					}
					collections.push(documents);
				});	
			});
			next(null, collections);
		});
};

exports.add = function(resourceTypeId, data, next) {
	ResourceType
		.findById(resourceTypeId)
		.exec(function(error, resourceType) {
			var Resource = null;
			
			if (error) {
				return next(parseError(error));
			}
			
			Resource = resourceType.model;
			Resource.create(data, function(error, resource) {
				if(error) {
					return next(parseError(error));
				}
				next(null, resource._id);
			});
		});
};

exports.update = function(resourceTypeId, resourceId, data, next) {
	ResourceType
		.findById(resourceTypeId)
		.exec(function(error, resourceType) {
			var Resource = null;
			
			if (error) {
				return next(parseError(error));
			}
			
			Resource = resourceType.model;
			Resource
				.findByIdAndUpdate(resourceId, data)
				.exec(function(error) {
					if (error) {
						return next(parseError(error));
					}
					next();
				});		
		});	
};

exports.delete = function(resourceTypeId, resourceId, next) {
	ResourceType
		.findById(resourceTypeId)
		.exec(function(error, resourceType) {
			var Resource = null;
			
			if (error) {
				return next(parseError(error));
			}
			
			Resource = resourceType.model;
			Resource
				.findByIdAndRemove(resourceId)
				.exec(function(error) {
					if (error) {
						return next(parseError(error));
					}
					next(null);
				});		
		});	
};

