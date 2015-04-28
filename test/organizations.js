var app = require('../app'),
	should = require('should'),
	agent = require('supertest').agent(app),
	login = require('./login'),
	testOrg = {
			name: 'testOrg' + Date.now()
		};
	
describe('organizations', function() {
		
	before(function(done) {
		login(agent, null, function(error) {
			if (error) {
				console.log(error);
			}
			done();
		});
	});

	it('should add create testOrg', function(done) {
		agent
			.post('/organizations/create')
			.send(testOrg)
			.end(function(error, response) {
				if (error) {
					throw error;
				}
				
				agent
					.get('/organizations/json/');
				done();
			});
	});
	
	it('should get details for testorgstatic', function(done) {
	    agent
			.get('/api/organizations/553f04e076d76db463e8d3d3')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(error, response) {
				response.status.should.equal(200);
				response.body.should.have.property('name', 'testorgstatic');
				done();
			});
	});
	
	it('should get a list of organizations', function(done) {
		agent
			.get('/api/organizations/')
			.expect(200)
			.end(function(error, response) {
				response.status.should.equal(200);
				response.body.should.not.equal(null);
				done();
			});
	});
	
	it('should return an error for an invalid organization', function(done) {
		agent
			.get('/api/organizations/nonexixtentOrg')
			.expect(500)
			.end(function(error, response) {
				response.status.should.equal(500);
				done();
			});
	});
});