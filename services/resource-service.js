var ResourceType = require('../models/ResourceTypeSchema').ResourceType,
	mongooseUtil = require('../util/mongoose-util');
	
var parseError = mongooseUtil.parseError;

exports.getAllByOrganizationId = function(organizationId, next) {
	ResourceType
		.find({ _organization: organizationId })
		.select('model')
		.exec(function(error, Models) {
			var collections = [];
			
			if (error) {
				return next(parseError(error));
			}
			
			Models.forEach(function(model) {
				model.findAll(function(error, documents) {
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
		.select('model')
		.exec(function(error, Model) {
			if (error) {
				return next(parseError(error));
			}
			Model.create(data, function(error) {
				if (error) {
					return next(parseError(error));
				}
				next();	
			});	
		});
};

exports.update = function(resourceTypeId, resourceId, data, next) {
	ResourceType
		.findById(resourceTypeId)
		.select('model')
		.exec(function(error, Model) {
			if (error) {
				return next(parseError(error));
			}
			Model
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
		.select('model')
		.exec(function(error, Model) {
			if (error) {
				return next(parseError(error));
			}
			Model
				.findByIdAndRemove(resourceId)
				.exec(function(error) {
					if (error) {
						return next(parseError(error));
					}
					next(null);
				});		
		});	
};

