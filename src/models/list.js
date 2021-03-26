var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var Variable = require("./variable.js");
var ListModifier = require("./list_modifier.js");
var Utils = require('../game/utils.js');

var ListVar = module.exports = Variable.extend({
	__name__: 'ListVar',
	defaults: {
		"default": [],
		"value": []
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

		var list = [];
		_.each(this.get("modifiers"), function(modifier) {
			if(ignore != modifier) {
				list = ListVar.addModifier(list, modifier);
			}
		});
		return list;
	},

	apply: function(guid, context) {
		var newvar = this.toJSON();
		newvar['modifiers'] = [];
		newvar['sources'] = [];
		if(this.has('default')) {
			newvar.value = Utils.deepClone(this.get('default'));
			if (ListVar.isValid(this.get('default'))) {
				newvar['modifiers'].push(new ListModifier({
					'operation': 'create',
					'value': Utils.deepClone(this.get('default')),
					'guid': guid,
					'context': context,
					'parameters': this.get('parameters')
				}));
			} else {
				throw new Error(this.variable + " Must be a list, not " + JSON.stringify(this.get('default')));
			}
		}
		return new ListVar(newvar);
	}
});

function arrayOperation(modifier, fxn) {
	var value = modifier.get('value');
	if (value instanceof Array) {
		_.each(value, function(v) {
			fxn(v);
		});
	} else {
		fxn(value);
	}
}

ListVar.isValid = function(value) {
	if(value instanceof Array) {
		return true;
	}
	return false;
}

ListVar.addModifier = function(list, modifier) {
	switch(modifier.get('operation')) {
		case "create":
			list = ListVar.create(modifier);
			break;
		case "shift":
			ListVar.shift(list);
			break;
		case "unshift":
			ListVar.unshift(list, modifier);
			break;
		case "push":
			ListVar.push(list, modifier);
			break;
		case "pop":
			ListVar.pop(list);
			break;
		case "insert":
			ListVar.insert(list, modifier);
			break;
		case "remove":
			list = ListVar.remove(list, modifier);
			break;
		case "replace":
			list = ListVar.replace(list, modifier);
			break;
		default:
			throw new Error("Don't recognize list modifier operation: " + modifier.get('operation'));
	}
	return list;
}

ListVar.create = function(modifier) {
	return modifier.get('value').slice(0);
}

ListVar.shift = function(list) {
	list.shift();
}

ListVar.unshift = function(list, modifier) {
	arrayOperation(modifier, function(value) {
		list.unshift(value);
	});
}

ListVar.push = function(list, modifier) {
	arrayOperation(modifier, function(value) {
		list.push(value);
	});
}

ListVar.pop = function pop(list) {
	list.pop();
}

ListVar.insert =  function insert(list, modifier) {
	var index = 1;
	if(modifier.has("index")) {
		index = modifier.get('index');
	}
	arrayOperation(modifier, function(value) {
		list.splice(index, 0, value);
	});
}

ListVar.remove = function remove(list, modifier) {
	arrayOperation(modifier, function(value) {
		list = _.without(list, value);
	});
	return list
}

ListVar.replace = function replace(list, modifier) {
	var value = modifier.get('value');
	if (value instanceof Array) {
		list = value;
	} else {
		list = [value];
	}
	return list
}
