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

exports.delete = function(resourceTypeId, next) {
	ResourceType
		.findByIdAndRemove(resourceTypeId)
		.exec(function(error) {
			if (error) {
				console.log('DELETE ERROR');
				console.log(error);
				return next(parseError(error));
			}
			next();
		});	
};

// exports.getAttributeFields = function() {
// 	return AttributeSchema;	
// };

