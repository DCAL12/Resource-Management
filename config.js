var config = {};

config.siteInfo = {
	siteTitle: 'Resource Management',
	siteDescription: 'A tool for managing organizational assets',
	cookieMaxAgeDays: 14
};

config.session = {
	secret: process.env.SESSION_SECRET || '#m5J8%X#aj2rEf',
	saveUninitialized: false,
	resave: false
};

config.databaseURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/';

module.exports = config;