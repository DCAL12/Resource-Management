var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var requestSchema = new Schema({
	resourceType: {
		type: String, 
	},
	description: {
		type: String, 
		required: 'A description is required'
	},
	startTime: {
		type: Date, 
		required: 'Start time is required'
	},
	endTime: {
		type: Date, 
		required: 'End time is required'
	},
	location: {
		type: String,
		required: 'A location is required'
	},
	createdOn: {
		type: Date, 
		default: Date.now
	}
});

var Request = mongoose.model('Request', requestSchema);

module.exports = { 
	Request: Request 
};