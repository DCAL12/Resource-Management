var config = {};

config.siteInfo = {
	siteTitle: 'Resource Management',
	siteDescription: 'A tool for managing organizational assets',
	usernameField: 'email'
};

config.session = {
	secret: '#m5J8%X#aj2rEf',
	saveUninitialized: false,
	resave: false
};

config.cookies = {
	cookieMaxAgeDays: 14,
	cookieMaxAgeMilliseconds: 14 * 24 * 60 * 60 * 1000	// milliseconds = days * 24hrs * 60min * 60sec * 1000
};

config.databaseURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/';

module.exports = config;