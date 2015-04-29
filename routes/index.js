var express = require('express'),
    restrictRoute = require('../authentication/restrictRoute'),
    config = require('../config.js');
    
var router = express.Router();

// Get Default/Home Page
router.get('/', function(request, response, next) {
    if (request.user) {
        return response.redirect('/welcome');
    }
    response.render('index');
});

router.get('/welcome', restrictRoute, function(request, response, next) {
    var viewData = {
        title: 'Welcome ' + (request.user.firstName ? 
            request.user.firstName : ''),
        className: 'welcome',
        user: request.user
        
    };
    response.render('index', viewData);
});

router.get('/login', function(request, response, next) {
    response.redirect('/users');
});

router.get('/logout', function(request, response, next) {
    response.redirect('/users/logout');
});

module.exports = router;
