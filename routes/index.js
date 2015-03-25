var express = require('express'),
    router = express.Router();

// Get Default/Home Page
router.get('/', function(request, response, next) {
  response.render('index', { title: 'Resource Management' });
});

module.exports = router;
