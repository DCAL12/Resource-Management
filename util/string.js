exports.toNameCase = function(inputString) {
	// Capitalize the first letter of a word
	return inputString.charAt(0).toUpperCase() + inputString.substring(1);
}