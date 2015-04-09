// Core/NPM Dependencies
var express = require('express');

var organizationService = require('../services/organization-service'),
    userService = require('../services/user-service'),
    workspaceService = require('../services/workspace-service'),
    restrictRoute = require('../authentication/restrictRoute');

var router = express.Router(),
    viewModel = {};

// Get Organization Page
router.get('/', function (request, response, next) {
    viewModel.title = 'Available Organizations',
    viewModel.className = 'organizations',
    viewModel.user = request.user ? request.user : null;
    viewModel.workspaces = request.session.workspaces ? 
        request.session.workspaces : null;
        
    organizationService.getOrganizations(function(error, organizations) {
        if (error) {
            viewModel.errorMessage = error;
            return response.render('organizations/index', viewModel);
        }
        viewModel.organizations = organizations;
        response.render('organizations/index', viewModel);
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
    viewModel.title = 'Create an Organization',
    viewModel.className = 'createOrganization',
    viewModel.user = request.user ? request.user : null;
    viewModel.workspaces = request.session.workspaces ? 
        request.session.workspaces : null;
    
    response.render('organizations/create', viewModel);
});

// Submit new organization form
router.post('/create', restrictRoute, function(request, response, next) {
    viewModel.title = 'Create an Organization';
    viewModel.className = 'createOrganization';
    viewModel.user = request.user ? request.user : null;
    viewModel.workspaces = request.session.workspaces ? 
        request.session.workspaces : null;
    viewModel.formInput = request.body;
    
    request.body.createdBy = request.user.email;
    
    organizationService.addOrganization(request.body, function(error, organization) {
        if (error) {
            viewModel.errorMessage = error; 
            return response.render('organizations/create', viewModel);
        }
        
        workspaceService.addWorkspace(request.user, organization, function(error) {
            if (error) {
                viewModel.errorMessage = error;
                return response.render('organizations/create', viewModel);        
            }
            
            if (request.body.defaultOrganization || !request.user.defaultOrganization) {
                request.user.defaultOrganization = request.body.organizationName;
                userService.updateUser(request.user, request.user, function(error) {
            
                    if (error) {
                        viewModel.errorMessage = error;
                        return response.render('organizations/create', viewModel); 
                    }       
                });        
            }
            response.redirect('/workspace');
        });
    });
});

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
        
        viewModel.title = organization.name;
        viewModel.className = 'organization';
        viewModel.user = request.user ? request.user : null;
        viewModel.workspaces = request.session.workspaces ? 
            request.session.workspaces : null;
        viewModel.organization = organization;
        
        response.render('organizations/organization', viewModel);
    });
});

module.exports = router;
