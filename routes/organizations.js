// Core/NPM Dependencies
var express = require('express'),
    organizationService = require('../services/organization-service'),
    userService = require('../services/user-service'),
    workspaceService = require('../services/workspace-service'),
    restrictRoute = require('../authentication/restrictRoute');

var router = express.Router();

// Restrict all to logged-in users
router.use(restrictRoute);

router.get('/', function (request, response, next) {
    response.redirect('/workspace');
});

router.get('/create', function(request, response, next) {
    var viewData = {
        title: 'Create an Organization',
        className: 'createOrganization',
        user: request.user
    };
    response.render('organizations/create', viewData);
});

router.post('/create', function(request, response, next) {
    var viewData = {
        title: 'Create an Organization',
        className: 'createOrganization',
        user: request.user
    };
    viewData.content = request.body;
        
    request.body.createdBy = request.user.email;
    organizationService.add(request.body, function(error, organizationId) {
        if (error) {
            viewData.status = {
                label: 'Error',
                message: error
            };
            return response.render('organizations/create', viewData);
        }
        
        workspaceService.add(request.user._id, organizationId, function(error) {
            if (error) {
                viewData.status = {
                    label: 'Error',
                    message: error
                };
                return response.render('organizations/create', viewData);        
            }
            
            if (request.body.defaultOrganization || !request.user._defaultOrganization) {
                
                request.user._defaultOrganization = organizationId;
                userService.update(request.user, request.user, function(error) {
            
                    if (error) {
                        viewData.status = {
                            label: 'Error',
                            message: error
                        };
                        return response.render('organizations/create', viewData); 
                    }       
                });        
            }
            response.redirect('/workspace#/org/' + organizationId);
        });
    });
});

module.exports = router;