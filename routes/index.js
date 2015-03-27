// Core/NPM Dependencies
var express = require('express');
    
var router = express.Router();

// Get Default/Home Page
router.get('/', function(request, response, next) {
    var viewModel = {
        title: 'Welcome to Resource Management',
        className: 'default',
        userName: request.user ? request.user.email : null
    };
    if (request.user) {
        response.redirect('/workspace');
    }
    response.render('index', viewModel);
});

router.get('/login', function(request, response, next) {
    response.redirect('/users');
});

module.exports = router;
