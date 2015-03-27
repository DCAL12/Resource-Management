// Core/NPM Dependencies
var express = require('express');
var passport = require('passport');

// Application modules
var userService = require('../services/user-service');
var restrictRoute = require('../authentication/restrictRoute');
var config = require('../config');

var router = express.Router();

// Get new user form
router.get('/create', function(request, response, next) {
    var viewModel = {
        title: 'Create an Account',
        className: 'createAccount',
        userName: request.user ? request.user.email : null
    };
    response.render('users/create', viewModel);
});

// Submit new user form
router.post('/create', function(request, response, next) {
    userService.addUser(request.body, function(error) {
        if (error) {
            var viewModel = {
                title: 'Create an Account',
                className: 'createAccount',
                userName: request.user ? request.user.email : null,
                formInput: request.body,
                errorMessage: error 
            };
            delete viewModel.formInput.password;
            return response.render('users/create', viewModel);
        }
        request.login(request.body, function(error) {
            if (error) {
                response.redirect('/users');
            }
            response.redirect('/workspace');
        });
    });
});

// Go to login
router.get('/', function (request, response, next) {
        var viewModel = {
        title: 'Login',
        className: 'login',
        userName: null,
        formInput: request.body,
        cookieMaxAge: config.cookieMaxAgeDays,
        errorMessage: request.flash('error')
    };
    delete viewModel.formInput.password;
    response.render('users/login', viewModel);
});

// Submit login
router.post('/login', 
    function(request, response, next) {
        // set the session cookie
        if(request.body.stayLoggedIn){
            request.session.cookie.maxAge = config.cookieMaxAgeMilliseconds;
        }
        next();
    },
    passport.authenticate('local', {
    failureFlash: 'username or password is incorrect',
    failureRedirect: '/users',
    successRedirect: '/workspace'
}));

// Modify account information
router.get('/account', restrictRoute, function(request, response, next) {
    var viewModel = {
        title: 'My Account',
        className: 'account',
        userName: request.user.email,
        user: request.user
    };
    delete viewModel.user.password;
    response.render('users/account', viewModel);
});

// Logout
router.get('/logout', function(request, response, next) {
    request.logout();
    request.session.destroy();
    response.redirect('/users');
});

module.exports = router;
