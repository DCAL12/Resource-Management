var app = require('../app'),
	should = require('should'),
	agent = require('supertest').agent(app),
	login = require('./login'),
	persistentData = require('./data/dbInput').persistentData,
	testResource = require('./data/dbInput').testData.resource;
	
describe('resources', function() {
	
	before(function(done) {
		login(agent, null, function(error) {
			if (error) {
				console.log(error);
			}
			done();
		});
	});
	
	it('should add a test resource', function(done) {
		agent
			.post('/api/resources/' 
				+ persistentData.organizations[0]._id 
				+ '/' 
				+ persistentData.resourceTypes[0]._id)
			.send(testResource)
			.expect(200)
			.end(function(error, response) {
				if (error) {
					throw error;
				}
				response.status.should.equal(200);
				testResource._id = response.body;
				done();
			});
	});
	
	it('should get details for a resource', function(done) {
	    agent
			.get('/api/resources/' 
			+ persistentData.organizations[0]._id
			+ '/' 
			+ persistentData.resourceTypes[0]._id
			+ '/'
			+ testResource._id)
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(error, response) {
				response.status.should.equal(200);
				response.body.should.have.property('tailNumber', testResource.tailNumber);
				done();
			});
	});
	
	it('should get all resources of a resourceType', function(done) {
	    agent
			.get('/api/resources/' 
			+ persistentData.organizations[0]._id
			+ '/' 
			+ persistentData.resourceTypes[0]._id)
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(error, response) {
				response.status.should.equal(200);
				done();
			});
	});
	
	it('should return an error for an invalid resource request', function(done) {
		agent
			.get('/api/resources/' 
			+ persistentData.organizations[0]._id
			+ '/' 
			+ persistentData.resourceTypes[0]._id
			+ '/nonexistentResource')
			.expect(500)
			.expect('Content-Type', /json/)
			.end(function(error, response) {
				response.status.should.equal(500);
				done();
			});
	});
	
	after(function(done) {
		agent
			.del('/api/resources/' 
				+ persistentData.organizations[0]._id 
				+ '/' 
				+ persistentData.resourceTypes[0]._id
				+ '/'
				+ testResource._id)
			.expect(200)
			.end(function(error, response) {
				if (error) {
					throw error;
				}
				response.status.should.equal(200);
				agent.get('/users/logout');
				done();
			});
	});
});