var express = require('express'),
    viewModel = require('../models/ViewModel');
    
var router = express.Router();

// Get Default/Home Page
router.get('/', function(request, response, next) {
    var viewData = viewModel({
        title: 'Welcome to Resource Management',
        className: 'default'        
    }, request.user, request.session);
    
    if (request.user) {
        return response.redirect('/welcome');
    }
    
    response.render('index', viewData);
});

router.get('/welcome', function(request, response, next) {
    var viewData = viewModel({
        title: 'Welcome ' + request.user.firstName,
        className: 'welcome'        
    }, request.user, request.session);
        
    response.render('index', viewData);
});

router.get('/login', function(request, response, next) {
    response.redirect('/users');
});

module.exports = router;
