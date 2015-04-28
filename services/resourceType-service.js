var ResourceType = require('../models/ResourceTypeSchema').ResourceType,
	AttributeSchema = require('../models/AttributeSchema'),
	mongooseUtil = require('../util/mongoose-util');
	
var parseError = mongooseUtil.parseError;	

exports.getAllByOrganizationId = function(organizationId, next) {
	ResourceType
		.find({ _id: organizationId })
		.exec(function (error, resourceTypes) {
			if (error) {
				return next(parseError(error));
			}
			next(null, resourceTypes);
		});
};

exports.add = function(organizationId, data, next) {
	data._organization = organizationId;
	ResourceType.create(data, function (error) {
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

exports.getAttributeFields = function() {
	return AttributeSchema;	
};

exports.generateCollectionName = function(resourceType, next) {
	// return error, null or formatted collection name
	resourceType.populate('_organization').exec(function(error, result) {
		if (error) {
			return next(error);
		}
		next(null, result + '-' + resourceType.name);
	});	
};

// CONSIDER REMOVING
// exports.getByOrganizationIdAndType = function(organizationId, resourceType, next) {
// 	ResourceType.findOne({
// 		_organization: organizationId,
// 		type: resourceType
// 	}, function (error, resourceType) {
// 		next(error, resourceType);
// 	});
// };

