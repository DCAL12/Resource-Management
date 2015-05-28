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

// Get timeline beta
router.get('/timeline-beta', restrictRoute, function(request, response, next) {
    var viewData = {
        title: 'Timeline (Beta)',
        className: 'timeline',
        user: request.user
    };
    response.render('workspace/timeline', viewData);    
});

// Get specific workspace page
router.get('/org/:organizationId', function(request, response, next) {
    organizationService.findById(request.params.organizationId, 
        function(error, organization) {
            
            var viewModel = null;
            
            if (error) {
                return next(error);
            }
            
            if (!organization) {
                return next(Object.create(Error, {
                    status: { value: 404 },
                    message: { value: 'The organization was not found' }
                }));
            }
           
            viewModel = {
                title: organization.name,
                className: 'workspace',
                user: request.user
            };
            response.render('workspace/', viewModel);
    });
});

module.exports = router;
