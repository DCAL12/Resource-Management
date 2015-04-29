var express = require('express'),
    passport = require('passport'),
    userService = require('../services/user-service'),
    sessionService = require('../services/session-service'),
    restrictRoute = require('../authentication/restrictRoute');

var router = express.Router();

router.get('/', restrictRoute, function(request, response, next) {
    response.redirect('/users/account');
});

router.route('/create')
    .get(function(request, response, next) {
        var viewModel = null;
        
        if (request.user) {
            request.logout();
            request.session.destroy();    
        }
        
        viewModel = {
            title: 'Create an Account',
            className: 'createAccount'
        };
    
        response.render('users/create', viewModel);
    })

    .post(function (request, response, next) {
        userService.add(request.body, function(error) {
            if (error) {
                var viewModel = {
                    title: 'Create an Account',
                    className: 'createAccount',
                    content: request.body,
                    status: {
                        label: 'Error',
                        message: error    
                    }
                };
                delete request.body.password;
                return response.status(500).render('users/create', viewModel);
            }
    
            request.login(request.body, function(error) {
                if (error) {
                    return response.status(500).redirect('/users');
                }
                response.redirect('/workspace');
            });
        });
    });

router.route('/login')
    .get(function(request, response, next) {
        var viewModel = {
            title: 'Login',
            className: 'login'
        };
        response.render('users/login', viewModel);
    })

    .post(function (request, response, next) {
        passport.authenticate('local', function(error, user) {
            var viewModel = {
                title: 'Login',
                className: 'login'
            };
            delete request.body.password;
            viewModel.content = request.body;
            
            if (error || !user) {
                viewModel.status = { 
                    label: 'Error',
                    message: 'The username or password is incorrect' 
                };
                return response.status(500).render('users/login', viewModel);
            }
            delete user.password;
            request.logIn(user, function(error) {
                if (error) {
                    console.log(error);
                    viewModel.status = {
                        label: 'Error',
                        message: error
                    };
                    return response.status(500).render('users/login', viewModel);
                }
                
                // set session information
                if (request.body.stayLoggedIn) {
                    sessionService.setCookieMaxAge(request.session);
                }
                response.redirect('/workspace');
            });
        })(request, response, next);
    });

router.get('/account', restrictRoute, function(request, response, next) {
    var viewModel = {
        title: 'My Account',
        className: 'account',
        user: request.user
    };
    response.render('users/account', viewModel);
});

router.put('/update', restrictRoute, function(request, response, next) {
    userService.update(request.user, request.body, function(error, user) {
        var viewModel = {
            title: 'My Account',
            className: 'account',
            user: request.user
        };
            
        if (error) {
            viewModel.status = {
                label: 'Error',
                message: error
            };
            return response.status(500).render('users/account', viewModel);
        }
        
        request.login(user, function(error) {
            if (error) {
                viewModel.status = {
                    label: 'Error',
                    message: error
                };
                return response.status(500).render('users/account', viewModel);
            }
            
            viewModel.status = {
                label: 'Success',
                message: 'Your profile has been updated!'
            };
            response.render('users/account', viewModel);
        });
    });
});

router.put('/change-password', restrictRoute, function(request, response, next) {
    userService.changePassword(request.user, request.body.password, function (error) {
        var viewModel = {
            title: 'My Account',
            className: 'account',
        };
        
        if (error) {
            viewModel.status = {
                label: 'Error',
                message: error
            };
            return response.status(500).render('users/account', viewModel);
        }
        
        viewModel.status = {
            label: 'Success',
            message: 'Your password has been updated'
        };
        response.render('users/account', viewModel);
    });
});

router.delete('/account', restrictRoute, function(request, response, next) {
    userService.delete(request.user._id, function (error) {
        if (error) {
            return response.status(500).json({ error: 'Failed to delete the user' });
        }
        response.json({ success: true });
    });
});

router.get('/logout', function(request, response, next) {
    request.logout();
    request.session.destroy();
    response.redirect('/users/login');
});

module.exports = router;