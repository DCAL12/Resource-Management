var express = require('express'),
    requestService = require('../../services/request-service'),
    restrictRoute = require('../../authentication/restrictRoute');

var router = express.Router();

// Restrict all API calls to logged-in users
router.use(restrictRoute);

router.route('/:organizationId/:requestId?')
    .get(function(request, response, next) {
        if (!request.params.requestId) return next();
        
        // Get details for a specific request
        requestService.getByRequestId(request.params.requestId, function(error, request) {
            if (error) {
                return response.status(500).json({ error: 'Failed to retrieve requests' });
            }
            response.json(request);
        });
    })
    
    .get(function(request, response, next) {
        
        // Get a list of requests for the specified organization
        requestService.getByOrganizationId(request.params.organizationId, function(error, requests) {
            if (error) {
                return response.status(500).json({ error: 'Failed to retrieve requests' });
            }
            response.json(requests);
        });
    })
    
    .post(function(request, response, next) {
        request.body._organization = request.params.organizationId;
        request.body._createdBy = request.user._id;
        requestService.add(request.body, function(error, requestId) {
            if (error) {
                console.log('ERROR');
                console.log(error);
                return response.status(500).json({ error: 'Failed to add the request' });
            }
            response.json(requestId);    
        });     
    })
    
    .put(function(request, response, next) {
        request.body._modifiedBy = request.user._id;
        request.body.lastModified = Date.now();
        requestService.update(request.params.requestId, request.body, function(error) {
            if (error) {
                return response.status(500).json({ error: 'Failed to update the request' });
            }
            response.json({ success: true });    
        });  
    })
    
    .delete(function(request, response, next) {
        requestService.delete(request.params.requestId, function(error) {
            if (error) {
                return response.status(500).json({ error: 'Failed to delete the request' });
            }
            response.json({ success: true });    
        });  
    });

module.exports = router;
