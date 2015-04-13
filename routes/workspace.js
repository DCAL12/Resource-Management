var express = require('express'),
    viewService = require('../services/view-service'),
    organizationService = require('../services/organization-service'),
    resourceTypeService = require('../services/resourceType-service'),
    resourceService = require('../services/resource-service'),
    requestService = require('../services/request-service'),
    restrictRoute = require('../authentication/restrictRoute');

var router = express.Router();

// Get Workspace default page
router.get('/', restrictRoute, function(request, response, next) {
    organizationService.findById(request.user._defaultOrganization, 
        function(error, organization) {
            if (error || !organization) {
                console.log(error || 'that organization does not exist');
                return response.redirect('/');    
            }
            response.redirect('workspace/' + organization.name);
    });
});

// Get specific workspace page
router.get('/:organizationName', function(request, response, next) {
    organizationService.findByName(request.param('organizationName'), 
        function(error, organization) {
            
            var viewData = null;
            
            if (error || !organization) {
                console.log(error || 'that organization does not exist');
                return response.redirect('/error');
            }
           
            viewData = {
                title: organization.name,
                className: 'workspace'
            };
            viewService.addUserInfo(request.user, viewData, function(viewData) {
                    
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
});

// Add resource type
router.post('/addResourceType', function (request, response, next) {
    organizationService.findByName(request.session.currentWorkspace, 
        function(error, organizationId) {
            
            var viewData = {
                title: request.session.currentWorkspace,
                className: 'workspace'
            };
            viewData.content = request.body;
            viewService.addUserInfo(request.user, viewData, function(viewData) {
            
                if(error) {
                    viewData.setStatus('Error', error);
                    return response.render('workspace/', viewData);    
                }
                
                resourceTypeService.add({
                    organization: organizationId,
                    type: request.body.resourceTypeName
                    
                }, function(error) {
                    if(error) {
                        viewData.setStatus('Error', error);
                        return response.render('workspace/', viewData);    
                    }
                    response.redirect(viewData.currentWorkspace);
                });
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
                            className: 'workspace'
                        };
                        viewData.content = request.body;
                        viewService.addUserInfo(request.user, viewData, function(viewData) {
                            
                            if (error) {
                                viewData.setStatus('Error', error);
                                return response.render('workspace/', viewData);
                            }
                            response.redirect('/workspace');
                        });
                });    
    });
    
});

// Add request
router.post('/addRequest', function (request, response, next) {
    requestService.addRequest({
        organization: request.body.organizationId,
        resourceType: request.body.resourceType, 
	    description: request.body.description,
	    startTime: request.body.startTime,
	    endTime: request.body.endTime,
	    location: request.body.location    
    }, function(error) {
        var viewData = {
            title: request.body.organizationName,
            className: 'workspace'
        };
        
        if (error) {
            console.log(error);
            viewData.content = request.body;
            viewData.setStatus('Error', error);
            return response.render('workspace/', viewData);
        }
        response.redirect('/workspace/' + request.body.organizationName);
    });
});

module.exports = router;
