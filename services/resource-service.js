var ResourceType = require('../models/ResourceTypeSchema').ResourceType,
	mongooseUtil = require('../util/mongoose-util');
	
var parseError = mongooseUtil.parseError;

exports.getByResourceTypeIdAndResourceId = function(resourceTypeId, resourceId, next) {
	ResourceType
		.findById(resourceTypeId)
		.exec(function(error, resourceType) {
			var Resource = null;
			
			if (error) {
				return next(parseError(error));
			}
			
			Resource = resourceType.model;
			Resource
				.findById(resourceId)
				.exec(function(error, resource) {
					if(error) {
						return next(parseError(error));
					}
					next(null, resource);
			});
		});
};

exports.getByResourceTypeId = function(resourceTypeId, next) {
	ResourceType
		.findById(resourceTypeId)
		.exec(function(error, resourceType) {
			var Resource = null;
			
			if (error) {
				return next(parseError(error));
			}
			
			Resource = resourceType.model;
			Resource
				.find()
				.exec(function(error, resources) {
					if(error) {
						return next(parseError(error));
					}
					next(null, resources);
			});
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

