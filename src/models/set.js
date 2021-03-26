var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');
var Set = require('set');

var Variable = require("./variable.js");
var SetModifier = require("./set_modifier.js");
var Utils = require('../game/utils.js');

var SetVar = module.exports = Variable.extend({
	__name__: 'SetVar',
	defaults: {
		"default": [],
		"value": new Set([])
	},

	setParameters: function(parameters) {
		this.set('parameters', parameters)
	},

	getValue: function() {
		var args = Array.prototype.slice.call(arguments);
		var ignore = null;
		_.each(args, function(arg) {
			if ("ignore" in arg) {
				ignore = arg.ignore;
			}
		});

		var set = new Set([]);
		_.each(this.get("modifiers"), function(modifier) {
			if(ignore != modifier) {
				set = SetVar.addModifier(set, modifier);
			}
		});
		return set;
	},

	apply: function(guid, context) {
		var newvar = this.toJSON();
		newvar['modifiers'] = [];
		newvar['sources'] = [];
		if(this.has('default')) {
			newvar.value = new Set(Utils.deepClone(this.get('default')));
			if (SetVar.isValid(this.get('default'))) {
				newvar['modifiers'].push(new SetModifier({
					'operation': 'create',
					'value': new Set(Utils.deepClone(this.get('default'))),
					'guid': guid,
					'context': context,
					'parameters': this.get('parameters')
				}));
			} else {
				throw new Error(this.variable + " Must be an Array, not " + JSON.stringify(this.get('default')));
			}
		}
		return new SetVar(newvar);
	}
});

SetVar.isValid = function(value) {
	if(value instanceof Array) {
		return true;
	}
	return false;
}

function setOperation(modifier, fxn) {
	var value = modifier.get('value');
	if (value instanceof Array) {
		fxn(new Set(value));
	} else {
		fxn(new Set([value]));
	}
}

SetVar.addModifier = function(set, modifier) {
	switch(modifier.get('operation')) {
		case "create":
			set = SetVar.create(modifier);
			break;
		case "add":
			SetVar.add(set, modifier);
			break;
		case "remove":
			SetVar.remove(set, modifier);
			break;
		case "clear":
			SetVar.clear(set);
			break;
		case "union":
			set = SetVar.union(set, modifier);
			break;
		case "intersect":
			set = SetVar.intersect(set, modifier);
			break;
		case "difference":
			set = SetVar.difference(set, modifier);
			break;
		default:
			throw new Error("Don't recognize set modifier operation: " + modifier.get('operation'));
	}
	return set;
}

SetVar.create = function(modifier) {
	return new Set(modifier.get('value').slice(0));
}

SetVar.add = function(set, modifier) {
	set.add(modifier.get('value'));
}

SetVar.remove = function(set, modifier) {
	set.remove(modifier.get('value'));
}

SetVar.clear = function(set, modifier) {
	set.clear();
}

SetVar.union = function(set, modifier) {
	setOperation(modifier, function(value) {
		set = set.union(value);
	});
	return set
}

SetVar.intersect = function(set, modifier) {
	setOperation(modifier, function(value) {
		set = set.intersect(value);
	});
	return set
}

SetVar.difference = function(set, modifier) {
	setOperation(modifier, function(value) {
		set = set.difference(value);
	});
	return set
}
