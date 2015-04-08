var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var workspaceSchema = new Schema({
	userName: {
		type: String, 
		required: 'A username is required'
	},
	organization: {
		type: String,
		required: 'An organization is required'
	},
	createdOn: {
		type: Date, 
		default: Date.now
	}
});

var Workspace = mongoose.model('Workspace', workspaceSchema);

module.exports = { 
	Workspace: Workspace 
};