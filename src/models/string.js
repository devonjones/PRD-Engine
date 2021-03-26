var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var Variable = require('./variable.js');
var Modifier = require("./modifier.js");

var StringVar = module.exports = Variable.extend({
	__name__: 'StringVar',
	defaults: {
		"default": "",
		"value": ""
	},

	setParameters: function(parameters) {
		this.set('parameters', parameters)
		var key = this.get('context') + "." + this.get('variable');
		if (key in parameters) {
			var value = parameters[key];
			if (StringVar.isValid(value)) {
				this.set('default', value);
			} else {
				throw new Error(key + " with value: " + value + " is not a string.")
			}
		}
	},

	getValue: function() {
		var args = Array.prototype.slice.call(arguments);
		var ignore = null;
		_.each(args, function(arg) {
			if ("ignore" in arg) {
				ignore = arg.ignore;
			}
		});
		var retval = "";
		_.each(this.get("modifiers"), function(modifier) {
			retval = String(modifier.get('value'));
		});
		return retval;
	},

	apply: function(guid, context) {
		var newvar = this.toJSON();
		newvar['modifiers'] = [];
		newvar['sources'] = [];
		if(this.has('default')) {
			newvar.value = this.get('default');
			if (StringVar.isValid(this.get('default'))) {
				newvar['modifiers'].push(new Modifier({
					'value': this.get('default'),
					'guid': guid,
					'context': context
				}));
			} else {
				throw new Error(this.variable + " Must be a string, not " + JSON.stringify(this.get('default')));
			}
		}
		return new StringVar(newvar);
	}
});

StringVar.isValid = function(value) {
	if(typeof value  == 'string') {
		return true;
	}
	return false;
}

