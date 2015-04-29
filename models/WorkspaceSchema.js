var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var workspaceSchema = new Schema({
	_user: {
		type: ObjectId,
		ref: 'User', 
		required: 'A user id is required'
	},
	_organization: {
		type: ObjectId,
		ref: 'Organization',
		required: 'An organization is required'
	},
	role: {
		type: String,
		lowercase: true,
		trim: true,
		enum: ['viewer', 'requestor', 'manager', 'owner'],
		default: 'viewer'
		}
});

var Workspace = mongoose.model('Workspace', workspaceSchema);

module.exports = { 
	Workspace: Workspace 
};