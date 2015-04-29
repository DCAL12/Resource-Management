var app = require('../app'),
	should = require('should'),
	guest = require('supertest')(app),
	agent = require('supertest').agent(app),
	login = require('./login');
	
describe('restrict route', function() {
	
	it('should restrict the workspace route', function(done) {
		guest
			.get('/workspace')
			.expect(302)
			.end(function(error, response) {
				if (error) {
					throw error;
				}
				response.status.should.equal(302);
				done();
			});
	});
	
	it('should login the test user', function(done) {
		login(agent, null, function(error) {
			if (error) {
				throw error;
			}
			done();
		});    
	});
	
	it('should allow the workspace route', function(done) {
		agent
			.get('/workspace')
			.expect(200)
			.end(function(error, response) {
				if (error) {
					throw error;
				}
				response.status.should.equal(200);
				done();
			});
	});
});