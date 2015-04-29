var app = require('../app'),
	should = require('should'),
	agent = require('supertest').agent(app),
	login = require('./login'),
	testOrg = require('./data/dbInput').testData.organization,
	persistentData = require('./data/dbInput').persistentData;
	
describe('organizations', function() {
		
	before(function(done) {
		login(agent, null, function(error) {
			if (error) {
				console.log(error);
			}
			done();
		});
	});

	it('should create a test organization', function(done) {
		agent
			.post('/organizations/create')
			.expect(302)
			.send(testOrg)
			.end(function(error, response) {
				if (error) {
					throw error;
				}
				response.status.should.equal(302);
				console.log(response);
				done();
			});
	});
	
	it('should get details for an organization', function(done) {
	    agent
			.get('/api/organizations/' + persistentData.organizations[0]._id)
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(error, response) {
				response.status.should.equal(200);
				response.body.should.have.property('name', persistentData.organizations[0].name);
				done();
			});
	});
	
	it('should get a list of organizations', function(done) {
		agent
			.get('/api/organizations/')
			.expect(200)
			.expect('Content-Type', /json/)
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