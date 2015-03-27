var config = {};

config.locals = {
	siteTitle: 'Resource Management',
	siteDescription: 'A tool for managing organizational assets',
	usernameField: 'email'
};

config.databaseURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/';

config.session = {
	secret: '#m5J8%X#aj2rEf',
	saveUninitialized: false,
	resave: false
};

config.cookieMaxAgeDays = 14;
config.cookieMaxAgeMilliseconds = config.cookieMaxAgeDays * 24 * 60 * 60 * 1000;

module.exports = config;