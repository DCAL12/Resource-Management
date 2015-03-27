// Core/NPM Dependencies
var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    expressSession = require('express-session'),
    flash = require('connect-flash');

// Application modules
var index = require('./routes/index'),
    users = require('./routes/users'),
    workspace = require('./routes/workspace'),
    config = require('./config'),
    passportConfig = require('./authentication/passport-config');

var app = express();
app.locals.config = config.locals;
passportConfig();

mongoose.connect(config.databaseURI);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession(config.session));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', index);
app.use('/users', users);
app.use('/workspace', workspace);

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
  app.use(function(error, request, response, next) {
    response.status(error.status || 500);
    response.render('error', {
      message: error.message,
      error: error
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(error, request, response, next) {
  response.status(error.status || 500);
  response.render('error', {
    message: error.message,
    error: {}
  });
});

module.exports = app;