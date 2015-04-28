var defaultCredentials = {
		email: 'test@test.net',
		password: 'testpw'
	};

module.exports = function(agent, credentials, done) {
	agent
		.post('/users/login')
		.send(credentials || defaultCredentials)
		.end(function(error, response) {
			if (error) {
				return done(error);
			}
			done();
		});
};