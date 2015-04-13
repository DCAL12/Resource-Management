var ResourceType = require('../models/ResourceTypeSchema').ResourceType,
	mongooseUtil = require('../util/mongoose-util');
	
var parseError = mongooseUtil.parseError;

exports.add = function(resourceTypeId, resource, next) {
	resourceTypeService.getByName()
	
	model.create(resource, function(error) {
		if (error) {
			return next(parseError(error));
		}
		next();
	});
};

exports.getAllByOrganizationId = function (organizationId, next) {
	ResourceType.find({ _organization: organizationId }, '_id type',
	function(error, results) {
		if (error) {
			return next(error);
		}
		next(null, results);
	});
};