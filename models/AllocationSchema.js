var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var allocationSchema = new Schema({
	_request: {
		type: ObjectId,
		ref: 'Request' 
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
	resources: [ObjectId],
	
	_modifiedBy: {
		type: ObjectId,
		ref: 'User',
	},
	lastModified: {
		type: Date, 
		default: Date.now
	}
});

var Allocation = mongoose.model('Allocation', allocationSchema);

module.exports = { 
	Allocation: Allocation 
};