var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var requestSchema = new Schema({
	_organization: {
		type: ObjectId,
		ref: 'Organization',
		required: 'An organization to request from is required'
	},
	_resourceType: {
		type: ObjectId,
		ref: 'ResourceType' 
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
	_createdBy: {
		type: ObjectId,
		ref: 'User',
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