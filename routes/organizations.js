// Core/NPM Dependencies
var express = require('express'),
    viewService = require('../services/view-service'),
    organizationService = require('../services/organization-service'),
    userService = require('../services/user-service'),
    workspaceService = require('../services/workspace-service'),
    restrictRoute = require('../authentication/restrictRoute');

var router = express.Router();

// Get Organization Page
router.get('/', function (request, response, next) {
    var viewData = {
        title: 'Available Organizations',
        className: 'organizations'
    };
    viewService.addUserInfo(request.user, viewData, function(viewData) {
        
        organizationService.findAll(function(error, organizations) {
            if (error) {
                viewData.status = {
                    label: 'Error',
                    message: error
                };
                return response.render('organizations/index', viewData);
            }
            
            viewData.organizations = organizations;
            response.render('organizations/index', viewData);
        });
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
    var viewData = {
        title: 'Create an Organization',
        className: 'createOrganization'
    };
    viewService.addUserInfo(request.user, viewData, function(viewData) {
        response.render('organizations/create', viewData);
    });
});

// Submit new organization form
router.post('/create', restrictRoute, function(request, response, next) {
    var viewData = {
        title: 'Create an Organization',
        className: 'createOrganization'
    };
    viewData.content = request.body;
    viewService.addUserInfo(request.user, viewData, function(viewData) {
        
        organizationService.add({
            name: request.body.name,
            createdBy: request.user.email
        }, function(error, organization) {
            if (error) {
                viewData.status = {
                    label: 'Error',
                    message: error
                };
                return response.render('organizations/create', viewData);
            }
            
            workspaceService.add(request.user._id, organization._id, function(error) {
                if (error) {
                    viewData.status = {
                        label: 'Error',
                        message: error
                    };
                    return response.render('organizations/create', viewData);        
                }
                
                if (request.body.defaultOrganization || !request.user._defaultOrganization) {
                    
                    request.user._defaultOrganization = organization._id;
                    userService.updateUser(request.user, request.user, function(error) {
                
                        if (error) {
                            viewData.status = {
                                label: 'Error',
                                message: error
                            };
                            return response.render('organizations/create', viewData); 
                        }       
                    });        
                }
                response.redirect('/workspace/' + organization.name);
            });
        });
    });
});

// Get organization page
router.get('/:organizationName', function(request, response, next) {
    var organizationName = request.param('organizationName');
    organizationService.findByName(organizationName, function(error, organization) {
        if (error) {
            return response.redirect('/organizations');
        }
        
        if (!organization) {
            return response.redirect('/error');
        }
        
        var viewData = {
            title: organization.name,
            className: 'organizations'
        };
        viewData.organization = organization;
        viewService.addUserInfo(request.user, viewData, function(viewData) {
            response.render('organizations/organization', viewData);
        });
    });
});

module.exports = router;