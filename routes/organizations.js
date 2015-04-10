// Core/NPM Dependencies
var express = require('express'),
    organizationService = require('../services/organization-service'),
    userService = require('../services/user-service'),
    workspaceService = require('../services/workspace-service'),
    restrictRoute = require('../authentication/restrictRoute'),
    viewModel = require('../models/ViewModel');

var router = express.Router();

// Get Organization Page
router.get('/', function (request, response, next) {
    var viewData = viewModel({
        title: 'Available Organizations',
        className: 'organizations'
    }, request.user, request.session);
        
    organizationService.getOrganizations(function(error, organizations) {
        if (error) {
            viewData.setStatus('Error', error);
            return response.render('organizations/index', viewData);
        }
        
        viewData.organizations = organizations;
        response.render('organizations/index', viewData);
    });
});

// Test route for JSON
// router.get('/json', function (request, response, next) {
//     var testRequest = {
//         resourceType: 'Resource Type',
//         description: 'Give me one',
//         startTime: 0,
//         endTime: 0,
//         location: 'here',
//     };
//     requestService.addRequest(testRequest, function (error) {
//         if (error) {
//             var viewModel = {
//                 title: 'Error',
//                 className: 'organization',
//                 userName: request.user ? request.user.email : null
//             };
//             return response.render('organization/index', viewModel);
//         }
//         response.json(testRequest);
//     });
// });

// Get new organization form
router.get('/create', restrictRoute, function(request, response, next) {
    var viewData = viewModel({
        title: 'Create an Organization',
        className: 'createOrganization'
    }, request.user, request.session);
    
    response.render('organizations/create', viewData);
});

// Submit new organization form
router.post('/create', restrictRoute, function(request, response, next) {
    var viewData = viewModel({
        title: 'Create an Organization',
        className: 'createOrganization'
    }, request.user, request.session);
    
    viewData.content = request.body;
    request.body.createdBy = request.user.email;
    
    organizationService.addOrganization(request.body, function(error, organization) {
        if (error) {
            viewData.setStatus('Error', error);
            return response.render('organizations/create', viewData);
        }
        
        workspaceService.addWorkspace(request.user, organization, function(error, workspace) {
            if (error) {
                viewData.setStatus('Error', error);
                return response.render('organizations/create', viewData);        
            }
            
            request.session.workspaces.push(workspace);
            
            if (request.body.defaultOrganization || !request.user.defaultOrganization) {
                request.user.defaultOrganization = request.body.organizationName;
                request.session.currentWorkspace = request.user.defaultOrganization;
                
                userService.updateUser(request.user, request.user, function(error) {
            
                    if (error) {
                        viewData.setStatus('Error', error);
                        return response.render('organizations/create', viewData); 
                    }       
                });        
            }
            response.redirect('/workspace');
        });
    });
});

// Get organization page
router.get('/:organizationName', function(request, response, next) {
    var organizationName = request.param('organizationName');
    organizationService.findOrganizationByName(organizationName, function(error, organization) {
        if (error) {
            console.log(error);
            return response.redirect('/organizations');
        }
        if (!organization) {
            return response.redirect('/error');
        }
        
        var viewData = viewModel({
            title: organization.name,
            className: 'organizations'
        }, request.user, request.session);
        
        viewData.organization = organization;
        response.render('organizations/organization', viewData);
    });
});

module.exports = router;
