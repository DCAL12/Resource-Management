var ResourceType = require('../models/ResourceTypeSchema').ResourceType,
	mongooseUtil = require('../util/mongoose-util');
	
var parseError = mongooseUtil.parseError;	

exports.add = function (resourceType, next) {
	ResourceType.create(resourceType, function (error) {
		if (error) {
			return next(parseError(error));
		}
		next(null);
	});
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

exports.getByOrganizationIdAndType = function (organizationId, resourceType, next) {
	ResourceType.findOne({
		_organization: organizationId,
		type: resourceType
	}, function (error, resourceType) {
		next(error, resourceType);
	});
};

exports.getAllByOrganization = function (organizationId, next) {
	ResourceType.find({
		_id: organizationId
	}, function (error, resourceTypes) {
		next(error, resourceTypes);
	});
};