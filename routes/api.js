var express = require('express'),
    organizationService = require('../services/organization-service'),
    requestService = require('../services/request-service'),
    resourceService = require('../services/resource-service'),
    resourceTypeService = require('../services/resourceType-service'),
    restrictRoute = require('../authentication/restrictRoute');

var router = express.Router();

// Restrict all API calls to logged-in users
router.use(restrictRoute);

router.get('/organizations', function (request, response, next) {
    organizationService.findAll(function(error, organizations) {
        if (error) {
            return response.status(500).json({ error: 'Failed to retrieve the organizations' });
        }
        response.json(organizations);
    });
});

router.route('/organizations/:organizationId')
    .get(function(request, response, next) {
        organizationService.findById(request.params.organizationId, function(error, organization) {
            if (error) {
                return response.status(500).json({ error: 'Failed to retrieve the organization' });
            }
            response.json(organization);
        });
    })
    
    .put(function(request, response, next) {
        organizationService.update(request.params.organizationId, request.body, function(error) {
            if (error) {
                return response.status(500).json({ error: 'Failed to update the organization' });
            }
            response.json({ success: true });    
        });
    })
    
    .delete(function(request, response, next) {
        organizationService.delete(request.params.organizationId, function(error) {
            if (error) {
                return response.status(500).json({ error: 'Failed to delete the organization' });
            }
            response.json({ success: true });    
        });  
    });
    
router.route('/requests/:organizationId/:requestId?')
    .get(function(request, response, next) {
        if (!request.params.requestId) return next();
        
        // Get details for a specific request
        requestService.getByRequestId(request.params.requestId, function(error, request) {
            if (error) {
                return response.status(500).json({ error: 'Failed to retrieve requests' });
            }
            response.json(request);
        });
    })
    
    .get(function(request, response, next) {
        
        // Get a list of requests for the specified organization
        requestService.getByOrganizationId(request.params.organizationId, function(error, requests) {
            if (error) {
                return response.status(500).json({ error: 'Failed to retrieve requests' });
            }
            response.json(requests);
        });
    })
    
    .post(function(request, response, next) {
        request.body._organization = request.params.organizationId;
        requestService.add(request.body, function(error, requestId) {
            if (error) {
                return response.status(500).json({ error: 'Failed to add the request' });
            }
            response.json(requestId);    
        });     
    })
    
    .put(function(request, response, next) {
        requestService.update(request.params.requestId, request.body, function(error) {
            if (error) {
                return response.status(500).json({ error: 'Failed to update the request' });
            }
            response.json({ success: true });    
        });  
    })
    
    .delete(function(request, response, next) {
        requestService.delete(request.params.requestId, function(error) {
            if (error) {
                return response.status(500).json({ error: 'Failed to delete the request' });
            }
            response.json({ success: true });    
        });  
    });

router.route('/resources/:organizationId/:resourceTypeId?/:resourceId?')
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

router.route('/resourceTypes/:organizationId/:resourceTypeId?')
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
