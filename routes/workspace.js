var express = require('express'),
    router = express.Router();

// Get Workspace main page
router.get('/', function(request, response, next) {
    var viewModel = {
        title: 'Workspace',
        className: 'workspace'
    };
    response.render('workspace/index', viewModel);
});

module.exports = router;
