var ResourceType = require('../models/ResourceTypeSchema').ResourceType;

exports.addResourceType = function (resourceType, next) {
	var newResourceType = {
			name: resourceType.name.toLowerCase(),
			organization: resourceType.organization.toLowerCase()
		};
		
	ResourceType.create(newResourceType, function (error) {
		if (error) {
			return next(error.toString()
				.substring(
					error.toString()
					.indexOf(':') + 2
				));
		}
		next(null);
	});
};

exports.getResourceTypesByOrganization = function (organization, next) {
	ResourceType.find({
		organization: organization.name.toLowerCase()
	}, function (error, resourceTypes) {
		if (error) {
			next(error, null);
		}
		next(null, resourceTypes);
	});
};