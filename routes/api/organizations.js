var express = require('express'),
    organizationService = require('../../services/organization-service'),
    restrictRoute = require('../../authentication/restrictRoute');

var router = express.Router();

// Restrict all API calls to logged-in users
router.use(restrictRoute);

router.get('/', function (request, response, next) {
    organizationService.findAll(function(error, organizations) {
        if (error) {
            return response.status(500).json({ error: 'Failed to retrieve the organizations' });
        }
        response.json(organizations);
    });
});

router.route('/:organizationId')
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

module.exports = router;
