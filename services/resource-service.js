var Resource = require('../models/ResourceSchema').Resource

exports.addResource = function (resource, next) {
	var newResource = {
			name: resource.name.toLowerCase(),
			resourceType: resource.resourceType.toLowerCase(),
			organization: resource.organization.toLowerCase()
		};
		
	Resource.create(newResource, function (error) {
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

exports.getResourcesByOrganization = function (organization, next) {
	Resource.find({
		organization: organization.name.toLowerCase()
	}, function (error, resources) {
		if (error) {
			next(error, null);
		}
		next(null, resources);
	});
};