var config = {};

config.locals = {
	siteTitle: 'Resource Management',
	siteDescription: 'A tool for managing organizational assets'
};

config.databaseURI = process.env.MONGOLAB_URI;

module.exports = config;