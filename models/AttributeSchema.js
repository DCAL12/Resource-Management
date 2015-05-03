var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	schemaTypes = [ 
		'String', 
		'Number',
		'Date',
		'Boolean',
		'Array'
	];

module.exports = new Schema({
	name: {
		type: String, 
		required: 'An attribute name is required',
		unique: true
	},
	type: {
		type: String,
		enum: schemaTypes,
		required: 'A data type is required'
	},
	unique: {
		type: Boolean
	},
	required: {
		type: Boolean
	},
	min: {
		type: Number
	},
	max: {
		type: Number
	}	
}, { _id: false });