// Core/NPM Dependencies
var express = require('express');
    
var router = express.Router(),
    viewModel = {};

// Get Default/Home Page
router.get('/', function(request, response, next) {
    viewModel.title = 'Welcome to Resource Management';
    viewModel.className = 'default';
    viewModel.user = request.user ? request.user : null;
    viewModel.workspaces = request.session.workspaces ? 
        request.session.workspaces : null;
        
    response.render('index', viewModel);
});

router.get('/login', function(request, response, next) {
    response.redirect('/users');
});

module.exports = router;
