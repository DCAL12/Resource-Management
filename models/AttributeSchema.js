var mongoose = require('mongoose');

var Schema = mongoose.Schema;

module.exports = new Schema({
	name: {
		type: String, 
		required: 'An attribute name is required'
	},
	type: {
		type: String,
		enum: [
			'String', 
			'Number',
			'Date',
			'Boolean',
			'Array'	
		],
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
});