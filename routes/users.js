var express = require('express'),
    passport = require('passport'),
    userService = require('../services/user-service'),
    restrictRoute = require('../authentication/restrictRoute'),
    config = require('../config'),
    viewModel = require('../models/ViewModel');

var router = express.Router();

// Get new user form
router.get('/create', function (request, response, next) {
    var viewData = null;
    
    if (request.user) {
        request.logout();
    request.session.destroy();    
    }
    
    viewData = viewModel({
        title: 'Create an Account',
        className: 'createAccount'
    }, request.user, request.session);

    response.render('users/create', viewData);
});

// Submit new user form
router.post('/create', function (request, response, next) {
    userService.addUser(request.body, function (error) {
        if (error) {
            var viewData = viewModel({
                title: 'Create an Account',
                className: 'createAccount'
            }, request.user, request.session);

            delete request.body.password;
            viewData.content = request.body;
            viewData.setStatus('Error', error);

            return response.render('users/create', viewData);
        }

        request.login(request.body, function (error) {
            if (error) {
                response.redirect('/users');
            }
            response.redirect('/workspace');
        });
    });
});

// Go to login
router.get('/', function (request, response, next) {
    var viewData = viewModel({
        title: 'Login',
        className: 'login'
    });
    
    delete request.body.password;
    viewData.content = request.body;
    viewData.setStatus('Error', request.flash('error'));
    
    response.render('users/login', viewData);
});

// Submit login
router.post('/login',
    function (request, response, next) {
        // set the session cookie
        if (request.body.stayLoggedIn) {
            request.session.cookie.maxAge = config.cookies.cookieMaxAgeMilliseconds;
        }
        next();
    },
    passport.authenticate('local', {
        failureFlash: 'username or password is incorrect',
        failureRedirect: '/users',
        successRedirect: '/workspace'
}));

// Go to account information
router.get('/account', restrictRoute, function (request, response, next) {
    var viewData = viewModel({
        title: 'My Account',
        className: 'account'
    }, request.user, request.session);

    response.render('users/account', viewData);
});

// Update user profile
router.post('/update', function (request, response, next) {
    userService.updateUser(request.user, request.body, function (error, user) {
        var viewData = viewModel({
            title: 'My Account',
            className: 'account'
        }, request.user, request.session);

        if (error) {
            viewData.setStatus('Error', error);
            return response.render('users/account', viewData);
        }
        
        request.login(user, function (error) {
            if (error) {
                viewData.setStatus('Error', error);
                return response.render('users/account', viewData);
            }
            
            viewData = viewModel({
                title: 'My Account',
                className: 'account'
            }, user, request.session);
            
            viewData.setStatus('Success', 'your profile has been updated!');
            response.render('users/account', viewData);
        });
    });
});

// Change password
router.post('/change-password', function (request, response, next) {
    userService.changePassword(request.user, request.body.password, function (error) {
        var viewData = viewModel({
            title: 'My Account',
            className: 'account'
        }, request.user, request.session);

        if (error) {
            viewData.setStatus('Error', error);
            return response.render('users/account', viewData);
        }
        
        viewData.setStatus('Success', 'your password has been updated!');
        response.render('users/account', viewData);
    });
});

// Logout
router.get('/logout', function (request, response, next) {
    request.logout();
    request.session.destroy();
    response.redirect('/users');
});

module.exports = router;
