var mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema,
	schemaTypes = [ 
		'String', 
		'Number',
		'Date',
		'Boolean',
		'Array'
	]

var Attribute = new Schema({
	name: {
		type: String, 
		required: 'An attribute name is required',
		unique: true
	},
	type: {
		type: String,
		enum: schemaTypes,
		default: 'String',
		required: 'A data type is required'
	},
	required: {
		type: Boolean,
		default: false
	}
	// min: {
	// 	type: Number
	// },
	// max: {
	// 	type: Number
	// }	
});

Attribute.plugin(uniqueValidator, {
	message: 'An attribute with that name already exists'
});

module.exports = Attribute;