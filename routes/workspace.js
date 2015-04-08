// Core/NPM Dependencies
var express = require('express');
    
// Application modules
var workspaceService = require('../services/workspace-service'),
    restrictRoute = require('../authentication/restrictRoute');

var router = express.Router(),
    viewModel = {};

// Get Workspace main page
router.get('/', restrictRoute, function(request, response, next) {
    viewModel.title = 'Workspace';
    viewModel.className = 'workspace';
    viewModel.user = request.user ? request.user : null;
    
    workspaceService.getUserWorkspaces(request.user, 
        function(error, workspaces) {
            if (error) {
                console.log(error);
                return;
            }
            request.session.workspaces = workspaces;
            viewModel.workspaces = request.session.workspaces;
            response.render('workspace/index', viewModel);
        });
});

module.exports = router;
