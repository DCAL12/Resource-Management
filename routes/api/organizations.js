var express = require('express'),
    organizationService = require('../../services/organization-service'),
    userService = require('../../services/user-service'),
    workspaceService = require('../../services/workspace-service'),
    restrictRoute = require('../../authentication/restrictRoute');

var router = express.Router();

// Restrict all API calls to logged-in users
router.use(restrictRoute);

router.route('/:organizationId?')
    .get(function(request, response, next) {
        if (!request.params.organizationId) return next();
        
        // Get details for a specific organization
        organizationService.findByOrganizationId(
            request.params.organizationId, function(error, organization) {
                if (error) {
                    return response.status(500).json({ 
                        error: 'Failed to retrieve the organization' 
                    });
                }
                response.json(organization);
        });
    })
    
    .get(function (request, response, next) {
        
        // Get a list of all organizations
        organizationService.findAll(function(error, organizations) {
            if (error) {
                return response.status(500).json({ 
                    error: 'Failed to retrieve the organizations' 
                });
            }
            response.json(organizations);
        });
    })
    
    .post(function(request, response, next) {
        organizationService.add(request.body, function(error, organizationId) {
            if (error) {
                return response.status(500).json({ 
                    error: 'Failed to add organization'
                });
            }
            
            workspaceService.add(request.user._id, organizationId, function(error) {
                if (error) {
                    return response.status(500).json({ 
                        error: 'Failed to create user workspace', 
                        organizationId: organizationId
                    });
                }
                response.json(organizationId);
            });
        });
    })
    
    .put(function(request, response, next) {
        organizationService.update(
            request.params.organizationId, request.body, function(error) {
                if (error) {
                    return response.status(500).json({ 
                        error: 'Failed to update the organization'
                    });
                }
                response.json({ success: true });    
        });
    })
    
    .delete(function(request, response, next) {
        organizationService.delete(
            request.params.organizationId, function(error) {
                if (error) {
                    return response.status(500).json({ 
                        error: 'Failed to delete the organization' 
                    });
                }
                response.json({ success: true });    
        });  
    });

module.exports = router;
