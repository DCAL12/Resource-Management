var mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var taskAssignmentSchema = new Schema({
	_request: {
		type: ObjectId,
		ref: 'Request',
		required: 'A request id is required',
	},
	_resourceType: {
		type: ObjectId,
		ref: 'ResourceType',
		required: 'A resource type id is required'
	},
	priority: {
		type: Number,
	}
});

taskAssignmentSchema.plugin(uniqueValidator, {
	message: 'An identical task assignment already exists'
});

var TaskAssignment = mongoose.model('TaskAssignment', taskAssignmentSchema);

module.exports = { 
	TaskAssignment: TaskAssignment
};