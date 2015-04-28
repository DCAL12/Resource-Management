var app = require('../app'),
	should = require('should'),
	agent = require('supertest').agent(app),
	login = require('./login');
	
describe('users', function() {
	
	it('should add a new user', function(done) {
		var testUser = {
			firstName: 'testFirst',
			lastName: 'testLast',
			email: 'test@' + Date.now(),
			password: 'abc'
		};
		
		agent
			.post('/users/create')
			.send(testUser)
			.end(function(error, response) {
				if (error) {
					throw error;
				}
				login(agent, {
					email: testUser.email,
					password: testUser.password
				},function(error) {
					if (error) {
						throw error;
					}
					agent
						.get('/users/account')
						.expect(200)
						.end(function(error, response) {
							response.status.should.equal(200);
							done();
						});
				});
			});
	});
});