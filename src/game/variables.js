var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');
var JSONPath = require('JSONPath');

var Api = require('../api.js');
var Utils = require('./utils.js');
var Modifier = require("../models/modifier.js");

function applyModifier(variable, modifier) {
	if(variable.get('value') == null) {
		variable.set('value', 0);
	}
	if(Utils.isNumeric(modifier.get('value')) && Utils.isNumeric(variable.get('value'))) {
		var total = variable.getValue();
		if(variable.get('value') != total) {
			variable.set('value', total);
		}
	}
	else {
		if(variable.get('value') != modifier.get('value')) {
			variable.set('value', modifier.get('value'));
		}
	}
}

var getVariable = module.exports.getVariable = function(renderable, context, name) {
	if (name.indexOf('$') == 0) {
		return JSONPath.eval(renderable, name)[0];
	} else {
		return renderable[context][name];
	}
}

module.exports.updateVariable = function(renderable, context, newvar, guid) {
	var variable = getVariable(renderable, context, newvar.get('variable'));
	if(newvar.has('formula')) {
		var value = newvar.formula(Api, renderable);
		var b = {
			'value': value,
			'guid': guid,
			'context': context,
			"formula": newvar.get('formula')};
		if(newvar.has('parameters')) {
			b.parameters = newvar.get("parameters");
		}
		if(newvar.has('type')) {
			b.type = newvar.get('type');
		}
		var modifier = new Modifier(b);
		variable.get('modifiers').push(modifier);
		applyModifier(variable, modifier);
	}
}

var recalculateVariable = module.exports.recalculateVariable = function(renderable, variable) {
	var total = 0;
	_.each(variable.get('modifiers'), function(modifier) {
		if(modifier.has('formula')) {
			var value = modifier.formula(Api, renderable);
			if (value != modifier.get('value')) {
				modifier.set('value', value);
				applyModifier(variable, modifier);
			}
		}
	});
}

function addVariableApply(renderable, section, variable, context) {
	if (!(context in renderable)) {
		renderable[context] = {}
	}
	var name = variable.get("variable");

	if (name in renderable[context] == false) {
		renderable[context][name] = variable.apply(section.guid, context);
	}
}

module.exports.apply = function(renderable, section, applications, context) {
	if("variables" in applications) {
		_.each(applications.variables, function(varApply) {
			addVariableApply(renderable, section, varApply, context);
		});
	}
}
