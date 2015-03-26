// Dependencies
var express = require('express');

// Application modules/middleware
var userService = require('../services/user-service');

var router = express.Router();

// Go to login
router.get('/', function (request, response, next) {
        var viewModel = {
        title: 'Login',
        className: 'login'
    };
    response.render('users/login', viewModel);
});

// Get new user form
router.get('/create', function(request, response, next) {
    var viewModel = {
        title: 'Create an Account',
        className: 'createAccount'
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
                formInput: request.body,
                errorMessage: error 
            };
            delete viewModel.formInput.password;
            return response.render('users/create', viewModel);
        }
        response.redirect('/workspace');
    });
});

module.exports = router;
