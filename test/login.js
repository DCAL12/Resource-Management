var defaultUser = require('./data/dbInput').persistentData.users[0];

var defaultCredentials = {
		email: defaultUser.email,
		password: defaultUser.password
	};

module.exports = function(agent, credentials, done) {
	agent
		.post('/users/login')
		.send(credentials || defaultCredentials)
		.expect(302)
		.end(function(error, response) {
			if (error) {
				return done(error);
			}
			response.status.should.equal(302);
			done();
		});
};