var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var Variable = require('./variable.js');
var Modifier = require("./modifier.js");

var NumberVar = module.exports = Variable.extend({
	__name__: 'NumberVar',
	defaults: {
		"default": 0,
		"value": 0
	},

	setParameters: function(parameters) {
		this.set('parameters', parameters)
		var key = this.get('context') + "." + this.get('variable');
		if (key in parameters) {
			var value = parameters[key];
			if (!isNaN(value)) {
				this.set('default', Number(value));
			} else {
				throw new Error(key + " with value: " + value + " is not a number.")
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
		var sum = {"untyped": 0};
		_.each(this.get("modifiers"), function(modifier) {
			if(ignore != modifier) {
				if(modifier.get('value') < 0) {
					sum["untyped"] += modifier.get("value");
				} else if (modifier.has('type')) {
					var type = modifier.get('type');
					if (type in sum) {
						if (modifier.get('value') > sum[type]) {
							sum[type] = modifier.get('value');
						}
					} else {
						sum[type] = modifier.get('value')
					}
				} else {
					sum["untyped"] += modifier.get('value');
				}
			}
		});

		var total = 0;
		_.each(sum, function(inst) {
			total += inst;
		});
		return total;
	},

	apply: function(guid, context) {
		var newvar = this.toJSON();
		newvar['modifiers'] = [];
		newvar['sources'] = [];
		if(this.has('default')) {
			newvar.value = this.get('default');
			if (NumberVar.isValid(this.get('default'))) {
			newvar['modifiers'].push(new Modifier({
				'value': this.get('default'),
				'guid': guid,
				'context': context,
				'formula': this.get('default')
			}));
			} else {
				throw new Error(this.variable + " Must be a number, not " + JSON.stringify(this.get('default')));
			}
		}
		return new NumberVar(newvar);
	}
});

NumberVar.isValid = function(value) {
	if(typeof value == 'number') {
		return true;
	}
	return false;
}

