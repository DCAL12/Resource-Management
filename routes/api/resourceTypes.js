var express = require('express'),
    resourceTypeService = require('../../services/resourceType-service'),
    restrictRoute = require('../../authentication/restrictRoute');

var router = express.Router();

// Restrict all API calls to logged-in users
router.use(restrictRoute);

router.route('/attributes/:resourceTypeId/:attributeId?')
    .put(function(request, response, next) {
        resourceTypeService.attributeService.add(
            request.params.resourceTypeId, 
            request.body, 
            function(error, attributeId) {
                if (error) {
                    return response.status(500).json({ error: error });
                }
                response.json(attributeId);
        });
    })
    
    .delete(function(request, response, next) {
        resourceTypeService.attributeService.delete(
            request.params.resourceTypeId, 
            request.params.attributeId, 
            function(error) {
                if (error) {
                    return response.status(500)
                    .json({ error: 'Failed to delete the attribute' });
                }
                response.json({ success: true });    
        });  
    });
    
router.route('/:organizationId/:resourceTypeId?')
    .get(function(request, response, next) {
        resourceTypeService.getAllByOrganizationId(
            request.params.organizationId, 
            function(error, resourceTypes) {
                if (error) {
                    return response.status(500)
                        .json({ error: 'Failed to retrieve resource types' });
                }
                response.json(resourceTypes);
        });
    })
    
    .post(function(request, response, next) {
        request.body._organization = request.params.organizationId;
        resourceTypeService.add(request.body, function(error, resourceTypeId) {
            if (error) {
                console.log(error);
                return response.status(500).json({ error: error });
            }
            response.json(resourceTypeId);    
        });     
    })
    
    .put(function(request, response, next) {
        resourceTypeService.update(
            request.params.resourceTypeId, 
            request.body, 
            function(error) {
                if (error) {
                    return response.status(500).json({ error: error });
                }
                response.json({ success: true });
        });
    })
    
    .delete(function(request, response, next) {
        resourceTypeService.delete(
            request.params.resourceTypeId, 
            function(error) {
                if (error) {
                    return response.status(500)
                        .json({ error: 'Failed to delete the resource type' });
                }
                response.json({ success: true });    
        });  
    });

module.exports = router;
