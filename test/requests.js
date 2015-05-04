var app = require('../app'),
	should = require('should'),
	agent = require('supertest').agent(app),
	login = require('./login'),
	persistentData = require('./data/dbInput').persistentData,
	testRequest = require('./data/dbInput').testData.request;
	
describe('requests', function() {
	
	before(function(done) {
		login(agent, null, function(error) {
			if (error) {
				console.log(error);
			}
			done();
		});
	});
	
	it('should add a test request', function(done) {
		agent
			.post('/api/requests/' 
				+ persistentData.organizations[0]._id)
			.send(testRequest)
			.expect(200)
			.end(function(error, response) {
				if (error) {
					throw error;
				}
				response.status.should.equal(200);
				testRequest._id = response.body;
				done();
			});
	});
	
	it('should get details for the test request', function(done) {
	    agent
			.get('/api/requests/' 
			+ persistentData.organizations[0]._id
			+ '/' 
			+ testRequest._id)
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(error, response) {
				response.status.should.equal(200);
				response.body.should.have.property('description', testRequest.description);
				done();
			});
	});
	
	it('should get all requests for the test organization', function(done) {
	    agent
			.get('/api/requests/' + persistentData.organizations[0]._id)
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(error, response) {
				response.status.should.equal(200);
				done();
			});
	});
	
	it('should approve the test request', function(done) {
	    testRequest.status = 'approved';
	    testRequest.allocatedResources.push(persistentData.resources[0]._id);
	    
	    agent
	    	.put('/api/requests/'
	    	+ persistentData.organizations[0]._id
			+ '/' 
			+ testRequest._id)
			.expect(200)
			.send(testRequest)
			.end(function(error, response) {
				response.status.should.equal(200);
				done();
			});
	});
	
	after(function(done) {
		agent
			.del('/api/requests/' 
				+ persistentData.organizations[0]._id 
				+ '/' 
				+ testRequest._id)
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