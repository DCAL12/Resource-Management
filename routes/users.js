var express = require('express'),
    router = express.Router();

// Get users listing
router.get('/', function (request, response, next) {
        response.send('respond with a resource');
});

router.get('/create', function(request, response, next) {
    var viewModel = {
        title: 'Create an Account',
        className: 'createAccount'
    };
    response.render('users/create', viewModel);
});

router.post('/create', function(request, response, next) {
    if (postFailed) {
        var viewModel = {
            title: 'Create an Account',
            className: 'createAccount',
            formInput: request.body,
            error: 'Something went wrong, please try again'
        };
        delete viewModel.formInput.password;
        return response.render('users/create', viewModel);
    }
    response.render('users/create', viewModel);
});

module.exports = router;
