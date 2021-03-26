var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');
var JSONPath = require('JSONPath');

var Utils = require('./game/utils.js');
var Variables = require('./game/variables.js');
var Lists = require('./game/lists.js');

module.exports.Item = require('./api/item.js');
module.exports.Weapon = require('./api/weapon.js');

module.exports.min = _.min;
module.exports.max = _.max;

module.exports.floor = function(num) {
	return Math.floor(num);
}

module.exports.ceil = function(num) {
	return Math.ceil(num);
}

module.exports.hasListItem = function(renderable, modifier, path, item) {
	var node = JSONPath.eval(renderable, path)[0];
	if(!(node)) {
		return false;
	}
	if(node.__name__ == "ListVar") {
		var value = node.get('value');
		return _.indexOf(value, item) > -1;
	} else {
		throw new Error(path + " is not a list variable");
	}
}

module.exports.hasTag = function(renderable, tag) {
	var set = renderable.section.tags.get('value');
	return set.contains(tag)
}

module.exports.getVariable = function(renderable, modifier, path) {
	var node = JSONPath.eval(renderable, path)[0];
	if(!(node)) {
		return 0;
	}
	// To prevent the event being re-added on recalculation.  In that
	// instance, variable comes in as the Modifier, not the original variable
	if(modifier.__name__ == "Variable") {
		node.on("change:value", function() {
			var realvar = Variables.getVariable(
				renderable, modifier.get('context'), modifier.get('variable'))
			Variables.recalculateVariable(renderable, realvar);
		}, modifier);
	} else if(modifier.__name__ == "ListOperation") {
		node.on("change:value", function() {
			var realvar = Variables.getVariable(
				renderable, modifier.get('context'), modifier.get('variable'))
			Lists.recalculateList(renderable, realvar);
		}, modifier);
	}
	var value = node.getValue();
	if(modifier.__name__ == 'Modifier') {
		// Prevents infinite increment
		value = node.getValue({"ignore": modifier});
	} else if(modifier.__name__ == 'ListModifier') {
		// Prevents infinite increment
		value = node.getValue({"ignore": modifier});
	}
	if (Utils.isNumeric(value)) {
		return +value;
	}
	return value;
}

module.exports.getUrlArg = function(modifier, arg) {
	if (modifier.has('parameters')) {
		var params = modifier.get('parameters');
		if (arg in params) {
			var arg = params[arg];
			if (Utils.isNumeric(arg)) {
				return parseInt(arg);
			}
			return arg;
		}
	}
	throw new Error(arg + " not in modifier");
}
