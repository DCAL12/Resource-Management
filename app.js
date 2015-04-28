// Core/NPM Dependencies
var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    expressSession = require('express-session'),
    connectFlash = require('connect-flash'),
    connectMongo = require('connect-mongo');

// Application modules
var index = require('./routes/index'),
    users = require('./routes/users'),
    organizations = require('./routes/organizations'),
    workspace = require('./routes/workspace'),
    api = require('./routes/api'),
    config = require('./config'),
    passportConfig = require('./authentication/passport-config');
    

var app = express();
app.locals.siteInfo = config.siteInfo;

// Module setup
passportConfig();
mongoose.connect(config.databaseURI);
var MongoSessionStore = connectMongo(expressSession);
config.session.store = new MongoSessionStore({
    mongooseConnection: mongoose.connection
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware chain
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession(config.session));
app.use(connectFlash());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', index);
app.use('/users', users);
app.use('/organizations', organizations);
app.use('/workspace', workspace);
app.use('/api', api);

// Catch 404 and forward to error handler
app.use(function (request, response, next) {
    var error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Error Handlers
var viewData = {
    title: 'Error',
    className: 'error'
};

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(error, request, response, next) {
        response.status(error.status || 500);
        viewData.message = error.message;
        viewData.error = error;
        response.render('error', viewData);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(error, request, response, next) {
    response.status(error.status || 500);
    viewData.message = error.message;
    response.render('error', viewData);
});

module.exports = app;