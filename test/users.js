var app = require('../app'),
	should = require('should'),
	agent = require('supertest').agent(app),
	login = require('./login'),
	testUser = require('./data/dbInput').testData.user;
	
describe('users', function() {
	
	it('should create a test user', function(done) {
		agent
			.post('/users/create')
			.send(testUser)
			.expect(302)
			.end(function(error, response) {
				if (error) {
					throw error;
				}
				response.status.should.equal(302);
				done();
			});
	});
	
	it('should not login a user with incorrect credentials', function(done) {
		login(agent, {
			email: testUser.email,
			password: 'invalid password'
		}, function(error) {
			if (!error) {
				throw error;
			}
			done();
		});  	    
	});
	
	it('should login the test user', function(done) {
		login(agent, {
			email: testUser.email,
			password: testUser.password
		}, function(error) {
			if (error) {
				throw error;
			}
			done();
		});    
	});
	
	it('should update the test user firstName', function(done) {
	    agent
	    	.put('/users/update')
	    	.send({firstName: 'newFirstName'})
	    	.expect(200)
	    	.end(function(error, response) {
	    		if (error) {
	    			throw error;
	    		}
	    		response.status.should.equal(200);
	    		done();
	    	});
	});
	
	it('should remove the test user', function(done) {
	    agent
	    	.delete('/users/account')
	    	.expect(200)
	    	.end(function(error, response) {
	    		if (error) {
	    			throw error;
	    		}
	    		response.status.should.equal(200);
	    		done();
	    	});
	});
	
	after(function(done) {
		agent.get('/users/logout');
		done();
	});
});