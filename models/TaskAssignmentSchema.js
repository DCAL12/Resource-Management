var mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var taskAssignmentSchema = new Schema({
	request_id: {
		type: String, 
		required: 'A request id is required',
	},
	resourceType_id: {
		type: String,
		required: 'A resource type id is required'
	},
	priority: {
		type: String,
	}
});

taskAssignmentSchema.plugin(uniqueValidator, {
	message: 'An identical task assignment already exists'
});

var TaskAssignment = mongoose.model('Resource', taskAssignmentSchema);

module.exports = { 
	TaskAssignment: TaskAssignment
};