var express = require('express'),
    router = express.Router();

// Get Default/Home Page
router.get('/', function(request, response, next) {
    var viewModel = {
        title: 'Welcome to Resource Management',
        className: 'default'
    };
    response.render('index', viewModel);
});

module.exports = router;
