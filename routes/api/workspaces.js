var express = require('express'),
    organizationService = require('../../services/organization-service'),
    userService = require('../../services/user-service'),
    workspaceService = require('../../services/workspace-service'),
    restrictRoute = require('../../authentication/restrictRoute');

var router = express.Router();

// Restrict all API calls to logged-in users
router.use(restrictRoute);

router.get('/:organizationId/role', function(request, response, next) {
    workspaceService.getRole(
        request.params.organizationId,
        request.user._id,
        function(error, role) {
            
        if (error) {
            return response.status(500).json({ 
                error: 'Failed to retrieve the role' 
            });
        }
        response.json(role);    
    });
});

router.route('/:organizationId')
    .get(function(request, response, next) {
        
        organizationService.findByOrganizationId(
            request.params.organizationId, function(error, organization) {
                if (error) {
                    return response.status(500).json({ 
                        error: 'Failed to retrieve the organization' 
                    });
                }
                
                workspaceService.getAllByOrganization(
                    request.params.organizationId, 
                    function(error, workspaces) {
                        
                        if (error) {
                            return response.status(500).json({ 
                                error: 'Failed to retrieve the workspaces' 
                            });
                        } 
                        
                        return response.json(workspaces);
                });
        });
    })
    
    .post(function(request, response, next) {
        userService.findByEmail(request.body.email, function(error, userInfo) {
            if (error || !userInfo) {
                return response.status(500).json({ 
                    error: 'Failed to find requested user'
                });
            }
            
            workspaceService.add(
                userInfo._id, request.params.organizationId, request.body.role, 
                function(error, workspaceId) {
                    if (error) {
                        return response.status(500).json({ 
                            error: 'Failed to create user workspace'
                        });
                    }
                    response.json(workspaceId);
            });
        });
    });
    
    // .put(function(request, response, next) {
    //     organizationService.update(
    //         request.params.organizationId, request.body, function(error) {
    //             if (error) {
    //                 return response.status(500).json({ 
    //                     error: 'Failed to update the organization'
    //                 });
    //             }
    //             response.json({ success: true });    
    //     });
    // })
    
    // .delete(function(request, response, next) {
    //     organizationService.delete(
    //         request.params.organizationId, function(error) {
    //             if (error) {
    //                 return response.status(500).json({ 
    //                     error: 'Failed to delete the organization' 
    //                 });
    //             }
    //             response.json({ success: true });    
    //     });  
    // });

module.exports = router;
