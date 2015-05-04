var express = require('express'),
    resourceService = require('../../services/resource-service'),
    restrictRoute = require('../../authentication/restrictRoute');

var router = express.Router();

// Restrict all API calls to logged-in users
router.use(restrictRoute);

router.route('/:organizationId/:resourceTypeId?/:resourceId?')
    .get(function(request, response, next) {
        if (!request.params.resourceId) return next();
        
        // Get details for a specific resource
        resourceService.getByResourceTypeIdAndResourceId(
        request.params.resourceTypeId, request.params.resourceId,
        function(error, resource) {
            
            if (error) {
                return response.status(500).json({ error: 'Failed to retrieve resources' });
            }
            
            // resource will be a single object
            response.json(resource);
        });    
    })
    
    .get(function(request, response, next) {
        
        // Get a list of resources of the specified type
        resourceService.getByResourceTypeId(
        request.params.resourceTypeId,
        function(error, resources) {
            if (error) {
                return response.status(500).json({ error: 'Failed to retrieve resources' });
            }
            
            // resources will be an array of objects, each a resource of the resourceType
            response.json(resources);
        });    
    })
    
    .post(function(request, response, next) {
        resourceService.add(request.params.resourceTypeId, request.body, function(error, resourceId) {
            if (error) {
                return response.status(500).json({ error: 'Failed to add the resource' });
            }
            response.json(resourceId);    
        });     
    })
    
    .put(function(request, response, next) {
        resourceService.update(request.params.resourceTypeId, request.params.resourceId, request.body, function(error) {
            if (error) {
                return response.status(500).json({ error: 'Failed to update the resource' });
            }
            response.json({ success: true });    
        });  
    })
    
    .delete(function(request, response, next) {
        resourceService.delete(request.params.resourceTypeId, request.params.resourceId, function(error) {
            if (error) {
                return response.status(500).json({ error: 'Failed to delete the resource' });
            }
            response.json({ success: true });    
        });  
    });

module.exports = router;
