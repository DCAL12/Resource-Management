// Core Dependencies
var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

// Application modules
var index = require('./routes/index'),
    users = require('./routes/users');

var app = express();
app.locals.siteTitle = 'Resource Management';
app.locals.siteDescription = 'A tool for managing organizational assets';
app.locals.navigationItems = [
    {
        title: 'Users',
        route: '/users'
    },
    {
        title: 'view 2',
        route: '/view2'
    },
    {
        title: 'view 3',
        route: '/view3'
    }
];
app.locals.userName;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Plugin Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', index);
app.use('/users', users);

// Catch 404 and forward to error handler
app.use(function (request, response, next) {
    var error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Error Handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (error, request, response, next) {
        var viewModel;
        response.status(error.status || 500);
        viewModel = {
            title: 'Error',
            className: 'error',
            message: error.message,
            error: error
        };
        response.render('error', viewModel);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (error, request, response, next) {
    var viewModel;
    response.status(error.status || 500);
    viewModel = {
        title: 'Error',
        className: 'error',
        message: error.message,
        error: {}
    };
    response.render('error', viewModel);
});

module.exports = app;