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
        requestService.getAllByOrganizationId(request.params.organizationId, function(error, requests) {
            if (error) {
                return response.status(500).json({ error: 'Failed to retrieve requests' });
            }
            response.json(requests);
        });
    })
    
    .post(function(request, response, next) {
        requestService.add(request.params.organizationId, request.body, function(error) {
            if (error) {
                return response.status(500).json({ error: 'Failed to add the request' });
            }
            response.json({ success: true });    
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
        resourceService.getAllByOrganizationId(request.params.organizationId, function(error, resources) {
            if (error) {
                return response.status(500).json({ error: 'Failed to retrieve resources' });
            }
            // resources will be an array of collections, each containing an array of all resources of that resourceType
            response.json(resources);
        });
    })
    
    .post(function(request, response, next) {
        resourceService.add(request.params.resourceTypeId, request.body, function(error) {
            if (error) {
                return response.status(500).json({ error: 'Failed to add the resource' });
            }
            response.json({ success: true });    
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
        resourceTypeService.add(request.params.organizationId, request.body, function(error) {
            if (error) {
                return response.status(500).json({ error: 'Failed to add the resource type' });
            }
            response.json({ success: true });    
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
