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
	quantity: {
		type: Number,
		required: 'A quantity is required',
		default: 1,
		min: 1
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
	createdTime: {
		type: Date,
		default: Date.now
	},
	status: {
		type: String,
		enum: [
			'pending', 
			'approved',
			'approved with modification',
			'denied',
			'cancelled'
		],
		required: 'A current status is required',
		default: 'pending'
	},
	allocatedResources: [ObjectId],
	
	_modifiedBy: {
		type: ObjectId,
		ref: 'User',
	},
	lastModified: {
		type: Date, 
		default: Date.now
	}
});

var Request = mongoose.model('Request', requestSchema);

module.exports = { 
	Request: Request 
};