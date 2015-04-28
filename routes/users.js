var express = require('express'),
    passport = require('passport'),
    userService = require('../services/user-service'),
    sessionService = require('../services/session-service'),
    restrictRoute = require('../authentication/restrictRoute');

var router = express.Router();

// Get new user form
router.get('/create', function (request, response, next) {
    var viewData = null;
    
    if (request.user) {
        request.logout();
        request.session.destroy();    
    }
    
    viewData = {
        title: 'Create an Account',
        className: 'createAccount'
    };

    response.render('users/create', viewData);
});

// Submit new user form
router.post('/create', function (request, response, next) {
    userService.add(request.body, function (error) {
        if (error) {
            var viewData = {
                title: 'Create an Account',
                className: 'createAccount',
                content: request.body,
                status: {
                    label: 'Error',
                    message: error    
                }
            };
            delete request.body.password;
            return response.render('users/create', viewData);
        }

        request.login(request.body, function (error) {
            if (error) {
                return response.redirect('/users');
            }
            response.redirect('/workspace');
        });
    });
});

// Go to login
router.get('/', function (request, response, next) {
    var viewData = {
        title: 'Login',
        className: 'login'
    };
    response.render('users/login', viewData);
});

// Submit login
router.post('/login', function (request, response, next) {
    passport.authenticate('local', function(error, user) {
        var viewData = {
            title: 'Login',
            className: 'login'
        };
        delete request.body.password;
        viewData.content = request.body;
        
        if (error || !user) {
            viewData.status = { 
                label: 'Error',
                message: 'The username or password is incorrect' 
            };
            return response.render('users/login', viewData);
        }
        delete user.password;
        request.logIn(user, function(error) {
            if (error) {
                console.log(error);
                viewData.status = {
                    label: 'Error',
                    message: error
                };
                return response.render('users/login', viewData);
            }
            
            // set session information
            if (request.body.stayLoggedIn) {
                sessionService.setCookieMaxAge(request.session);
            }
            
            response.redirect('/workspace');
        });
    })(request, response, next);
});

// Go to account information
router.get('/account', restrictRoute, function (request, response, next) {
    var viewData = {
        title: 'My Account',
        className: 'account',
        user: request.user
    };
    response.render('users/account', viewData);
});

// Update user profile
router.post('/update', function (request, response, next) {
    userService.update(request.user, request.body, function (error, user) {
        var viewData = {
            title: 'My Account',
            className: 'account',
            user: request.user
        };
            
        if (error) {
            viewData.status = {
                label: 'Error',
                message: error
            };
            return response.render('users/account', viewData);
        }
        
        request.login(user, function (error) {
            if (error) {
                viewData.status = {
                    label: 'Error',
                    message: error
                };
                return response.render('users/account', viewData);
            }
            
            viewData.status = {
                label: 'Success',
                message: 'Your profile has been updated!'
            };
            response.render('users/account', viewData);
        });
    });
});

// Change password
router.post('/change-password', function (request, response, next) {
    userService.changePassword(request.user, request.body.password, function (error) {
        var viewData = {
            title: 'My Account',
            className: 'account',
        };
        
        if (error) {
            viewData.status = {
                label: 'Error',
                message: error
            };
            return response.render('users/account', viewData);
        }
        
        viewData.status = {
            label: 'Success',
            message: 'Your password has been updated'
        };
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
