var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

// Utility Functions
module.exports.underToCapital = function(string) {
	results = "";
	spstr = string.split("_");
	forEach(spstr, function(word) {
		results += capitalize(word) + " ";
	});
	return results;
}

capitalize = module.exports.capitalize = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports.isNumeric = function(num){
	if (num instanceof Array) {
		return false;
	}
	return !isNaN(num)
}

module.exports.guid = (function() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return function() {
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			   s4() + '-' + s4() + s4() + s4();
	};
})();

module.exports.deepClone = function(obj) {
	return JSON.parse(JSON.stringify(obj));
}
