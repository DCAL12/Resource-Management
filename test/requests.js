var app = require('../app'),
	should = require('should'),
	agent = require('supertest').agent(app),
	login = require('./login'),
	testOrgId = '553f04e076d76db463e8d3d3';
	
// describe('requests', function() {
		
// 	before(function(done) {
// 		login(agent, null, function(error) {
// 			if (error) {
// 				console.log(error);
// 			}
// 			done();
// 		});
// 	});
	
// 	it('should add a new request for testorgstatic', function(done) {
// 	    var testRequest = {
// 	    	resourceType: 'TestType',
// 	    	description: 'Requesting 1x TestType for a thing',
// 	    	startTime: Date.now(),
// 	    	endTime: Date.now(),
// 	    	location: 'Over here'
// 	    };
	    		    
// 	    agent
// 	    	.post('/requests/add/553f04e076d76db463e8d3d3')
// 	    	.send(testRequest)
// 	    	.expect(200)
// 	    	.end(function(error, response) {
// 	    		if(error) {
// 	    			throw error;
// 	    		}
// 	    		response.status.should.equal(200);
// 	    		done();
// 	    	});
// 	});
// });