var express = require('express'),
    resourceTypeService = require('../../services/resourceType-service'),
    restrictRoute = require('../../authentication/restrictRoute');

var router = express.Router();

// Restrict all API calls to logged-in users
router.use(restrictRoute);

router.route('/:organizationId/:resourceTypeId?')
    .get(function(request, response, next) {
        resourceTypeService.getAllByOrganizationId(request.params.organizationId, function(error, resourceTypes) {
            if (error) {
                return response.status(500).json({ error: 'Failed to retrieve resource types' });
            }
            response.json(resourceTypes);
        });
    })
    
    .post(function(request, response, next) {
        resourceTypeService.add(request.params.organizationId, request.body, function(error, resourceTypeId) {
            if (error) {
                return response.status(500).json({ error: error });
            }
            response.json(resourceTypeId);    
        });     
    })
    
    .put(function(request, response, next) {
        return response.status(501).json({ error: 'Not implemented' });
    })
    
    .delete(function(request, response, next) {
        resourceTypeService.delete(request.params.resourceTypeId, function(error) {
            if (error) {
                return response.status(500).json({ error: 'Failed to delete the resource type' });
            }
            response.json({ success: true });    
        });  
    });

module.exports = router;
