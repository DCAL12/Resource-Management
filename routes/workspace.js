// Core/NPM Dependencies
var express = require('express');
    
// Application modules
var restrictRoute = require('../authentication/restrictRoute');

var router = express.Router();

// Get Workspace main page
router.get('/', restrictRoute, function(request, response, next) {
    var viewModel = {
        title: 'Workspace',
        className: 'workspace',
        userName: request.user ? request.user.email : null,
    };
    response.render('workspace/index', viewModel);
});

module.exports = router;
