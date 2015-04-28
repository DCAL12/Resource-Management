var express = require('express'),
    organizationService = require('../services/organization-service'),
    resourceTypeService = require('../services/resourceType-service'),
    resourceService = require('../services/resource-service'),
    requestService = require('../services/request-service'),
    restrictRoute = require('../authentication/restrictRoute');

var router = express.Router();

// Get Workspace default page
router.get('/', restrictRoute, function (request, response, next) {
    var viewData = {
        title: 'Workspace',
        className: 'workspace',
        user: request.user
    };
    response.render('workspace/index', viewData);
});

// Get specific workspace page
router.get('/org/:organizationName', function(request, response, next) {
    organizationService.findByName(request.param('organizationName'), 
        function(error, organization) {
            
            var viewData = null;
            
            if (error) {
                return next(error);
            }
            
            if (!organization) {
                return next(Object.create(Error, {
                    status: { value: 404 },
                    message: { value: 'The organization was not found' }
                }));
            }
           
            viewData = {
                title: organization.name,
                className: 'workspace',
                user: request.user
            };
                    
            // Populate workspace info
            viewData.message = {
                requests: null,
                resources: null,
                resourceTypes: null
            };
            requestService.getAllByOrganizationId(organization._id, 
                function(error, requests) {
                    if (error || !requests.length > 0) {
                        viewData.message.requests = 
                        ('Error: ' + error || 'No requests found');
                    }
                    else {
                        viewData.requests = requests;    
                    }
            });
                
            resourceService.getAllByOrganizationId(organization._id, 
                function(error, resources) {
                    if (error || !resources.length > 0) {
                        viewData.message.requests = 
                        ('Error: ' + error || 'No resources found');
                    }
                    else {
                        viewData.requests = resources;    
                    }
            });
            
            resourceTypeService.getAllByOrganization(organization._id, 
                function(error, resourceTypes) {
                    if (error || !resourceTypes.length > 0) {
                        viewData.message.requests = 
                        ('Error: ' + error || 'No resource types found');
                    }
                    else {
                        viewData.requests = resourceTypes;    
                    }
            });
            response.render('workspace/', viewData);
    });
});



// Add resource type
router.post('/addResourceType', function (request, response, next) {
    organizationService.findByName(request.session.currentWorkspace, 
        function(error, organizationId) {
            
            var viewData = {
                title: request.session.currentWorkspace,
                className: 'workspace',
                user: request.user,
                content: request.body
            };
            
            if(error) {
                viewData.setStatus('Error', error);
                return response.render('workspace/', viewData);    
            }
            
            resourceTypeService.add({
                organization: organizationId,
                type: request.body.resourceTypeName
                
            }, function(error) {
                if(error) {
                    viewData.status = {
                        label: 'Error',
                        message: error
                    };
                    return response.render('workspace/', viewData);    
                }
                response.redirect(viewData.currentWorkspace);
            });
    });
});

// Add resource
router.post('/addResource', function (request, response, next) {
    
    resourceTypeService.getByName(
        request.body.organizationId, request.body.resourceTypeId,
            function(error, resourceTypeId) {
                
                resourceService.add(resourceTypeId, request.body, 
                    function(error) {
                        var viewData = {
                            title: request.session.currentWorkspace,
                            className: 'workspace',
                            user: request.user,
                            content: request.body
                        };
                        
                        if (error) {
                            viewData.status = {
                                label: 'Error',
                                message: error
                            };
                            return response.render('workspace/', viewData);
                        }
                        response.redirect('/workspace');
                        
                });    
    });
    
});

// Add request
router.post('/addRequest', function (request, response, next) {
    requestService.addRequest(request.body, function(error) {
        var viewData = {
            title: request.body.organizationName,
            className: 'workspace',
            user: request.user,
            content: request.body
        };
        
        if (error) {
            viewData.status = {
                label: 'Error',
                message: error
            };
            return response.render('workspace/', viewData);
        }
        response.redirect('/workspace/' + request.body.organizationName);
    });
});

module.exports = router;
