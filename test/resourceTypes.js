var app = require('../app'),
	should = require('should'),
	agent = require('supertest').agent(app),
	login = require('./login'),
	testResourceType = require('./data/dbInput').testData.resourceType,
	testOrg = require('./data/dbInput').persistentData.organizations[0];
	
describe('resource types', function() {
	
	before(function(done) {
		login(agent, null, function(error) {
			if (error) {
				console.log(error);
			}
			done();
		});
	});

	it('should create a test resource type', function(done) {
		agent
			.post('/api/resourceTypes/' + testOrg._id)
			.send(testResourceType)
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(error, response) {
				if (error) {
					throw error;
				}
				response.status.should.equal(200);
				testResourceType._id = response.body.resourceTypeId;
				done();
			});
	});
	
	// it('should add a test resource', function(done) {
	// 	agent
	// 		.post('/api/resources/' + testOrg._id + '/' + testResourceType._id)
	// 		.send(testResource)
	// 		.expect(200)
	// 		.end(function(error, response) {
	// 			if (error) {
	// 				throw error;
	// 			}
	// 			response.status.should.equal(200);
	// 			done();
	// 		});
	// });
	
	// it('should get details for an organization', function(done) {
	//     agent
	// 		.get('/api/organizations/' + persistentData.organizations[0]._id)
	// 		.expect(200)
	// 		.expect('Content-Type', /json/)
	// 		.end(function(error, response) {
	// 			response.status.should.equal(200);
	// 			response.body.should.have.property('name', persistentData.organizations[0].name);
	// 			done();
	// 		});
	// });
	
	// it('should get a list of organizations', function(done) {
	// 	agent
	// 		.get('/api/organizations/')
	// 		.expect(200)
	// 		.expect('Content-Type', /json/)
	// 		.end(function(error, response) {
	// 			response.status.should.equal(200);
	// 			response.body.should.not.equal(null);
	// 			done();
	// 		});
	// });
	
	// it('should return an error for an invalid organization', function(done) {
	// 	agent
	// 		.get('/api/organizations/nonexixtentOrg')
	// 		.expect(500)
	// 		.end(function(error, response) {
	// 			response.status.should.equal(500);
	// 			done();
	// 		});
	// });
	
	after(function(done) {
		agent
			.del('/api/resourceTypes/' 
				+ testOrg._id 
				+ '/' 
				+ testResourceType._id)
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