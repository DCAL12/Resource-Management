var express = require('express'),
    workspaceService = require('../services/workspace-service'),
    organizationService = require('../services/organization-service'),
    resourceTypeService = require('../services/resourceType-service'),
    resourceService = require('../services/resource-service'),
    requestService = require('../services/request-service'),
    restrictRoute = require('../authentication/restrictRoute'),
    viewModel = require('../models/ViewModel');

var router = express.Router();

// Get Workspace default page
router.get('/', restrictRoute, function(request, response, next) {
    workspaceService.getUserWorkspaces(request.user, function(error, workspaces) {
        var viewData = viewModel({
            title: 'Workspace',
            className: 'workspace'
        }, request.user, request.session, workspaces);
        
        if (error) {
            console.log(error);
            return response.redirect('/');
        }
        
        if (!viewData.currentWorkspace) {
            return response.redirect('/');        
        }
    
        viewData.title = viewData.currentWorkspace;
        response.redirect('workspace/' + viewData.currentWorkspace);
    });
});

// Get specific workspace page
router.get('/:workspaceName', function(request, response, next) {
    
    organizationService.findOrganizationByName(request.param('workspaceName'), function(error, organization) {
        var viewData = null;
        
        if (error) {
            console.log(error);
            return response.redirect('workspace/');
        }
        
        if (!organization) {
            return response.redirect('/error');
        }
        
        request.session.currentWorkspace = organization.name;
        viewData = viewModel({
            title: organization.name,
            className: 'workspace'
        }, request.user, request.session);
        
        organizationService.getOrganizationInfo(organization, {
            resourceTypes: true,
            resources: true,
            requests: true
        }, function(error, organizationInfo) {
            if (error) {
                viewData.setStatus('Error', error);
                return response.render('workspace/', viewData);
            }
            
            viewData.organizationInfo = organizationInfo;
            response.render('workspace/', viewData);    
        });
    });
});

// Add resource type
router.post('/addResourceType', function (request, response, next) {
    var newResourceType = {
        name: request.body.resourceTypeName,
        organization: request.session.currentWorkspace
    };
    
    resourceTypeService.addResourceType(newResourceType, function(error) {
        var viewData = viewModel({
            title: 'Workspace',
            className: 'workspace'
        }, request.user, request.session);
        
        if (error) {
            viewData.content = request.body;
            viewData.setStatus('Error', error);
            return response.render('workspace/', viewData);
        }
        
        viewData.title = viewData.currentWorkspace;
        response.redirect(viewData.currentWorkspace);
    });
});

// Add resource
router.post('/addResource', function (request, response, next) {
    var newResource = {
        name: request.body.resourceName,
        resourceType: request.body.resourceType,
        organization: request.session.currentWorkspace
    };
    
    resourceService.addResource(newResource, function(error) {
        var viewData = viewModel({
            title: 'Workspace',
            className: 'workspace'
        }, request.user, request.session);
        
        if (error) {
            console.log(error);
            viewData.content = request.body;
            viewData.setStatus('Error', error);
            return response.render('workspace/', viewData);
        }
        
        viewData.title = viewData.currentWorkspace;
        response.redirect(viewData.currentWorkspace);
    });
});

// Add request
router.post('/addRequest', function (request, response, next) {
    var newRequest = {
        organization: request.session.currentWorkspace,
        resourceType: request.body.req_resourceType, 
	    description: request.body.req_description,
	    startTime: request.body.req_startTime,
	    endTime: request.body. req_endTime,
	    location: request.body.req_location
	};
    
    requestService.addRequest(newRequest, function(error) {
        var viewData = viewModel({
            title: 'Workspace',
            className: 'workspace'
        }, request.user, request.session);
        
        if (error) {
            console.log(error);
            viewData.content = request.body;
            viewData.setStatus('Error', error);
            return response.render('workspace/', viewData);
        }
        
        viewData.title = viewData.currentWorkspace;
        response.redirect(viewData.currentWorkspace);
    });
});

module.exports = router;
