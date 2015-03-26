var config = {};

config.locals = {
	siteTitle: 'Resource Management',
	siteDescription: 'A tool for managing organizational assets'
};

config.databaseURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/'

module.exports = config;