var express = require('express'),
    viewService = require('../services/view-service'),
    restrictRoute = require('../authentication/restrictRoute');
    
var router = express.Router();

// Get Default/Home Page
router.get('/', function(request, response, next) {
    var viewData = {
        title: 'Welcome to Resource Management',
        className: 'default'        
    };
    
    if (request.user) {
        return response.redirect('/welcome');
    }
    response.render('index', viewData);
});

router.get('/welcome', restrictRoute, function(request, response, next) {
    var viewData = {
        title: 'Welcome ' + (request.user.firstName ? 
            request.user.firstName : ''),
        className: 'welcome'        
    };
    
    viewService.addUserInfo(request.user, viewData, 
        function(viewData) {
            response.render('index', viewData);
        });
});

router.get('/login', function(request, response, next) {
    response.redirect('/users');
});

router.get('/logout', function(request, response, next) {
    response.redirect('/users/logout');
});

module.exports = router;
