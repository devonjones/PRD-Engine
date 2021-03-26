var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');
var JSONPath = require('JSONPath');

var Api = require('../api.js');
var SetModifier = require("../models/set_modifier.js");
var SetVar = require("../models/set.js");
var Utils = require('../game/utils.js');

function createModifier(renderable, section, context, apply) {
	var mod = Utils.deepClone(apply);
	mod.value = getValue(renderable, apply);
	mod.guid = section.guid;
	mod.context = context;
	return new SetModifier(mod);
}

var getSet = module.exports.getSet = function(renderable, context, name) {
	if (name.indexOf('$') == 0) {
		return JSONPath.eval(renderable, name)[0];
	} else {
		return renderable[context][name];
	}
}

function getValue(renderable, apply) {
	if (apply.has('formula')) {
		return apply.formula(Api, renderable);
	} else if (apply.has('value')) {
		return apply.get('value');
	}
}

var recalculateSet = module.exports.recalculateSet = function(renderable, set) {
	var total = 0;
	_.each(set.get('modifiers'), function(modifier) {
		var value = getValue(renderable, modifier);
		modifier.set('value', value);
		var newset = SetVar.addModifier(set.get('value'), modifier);
		set.set('value', newset);
	});
}

module.exports.apply = function(renderable, section, applications, context) {
	if("sets" in applications) {
		_.each(applications.sets, function(setApply) {
			var modifier = createModifier(renderable, section, context, setApply);
			var set = getSet(renderable, context, setApply.get('variable'))
			var value = SetVar.addModifier(set.get('value'), modifier);
			set.set('value', value);
			set.get('modifiers').push(modifier);
		});
	}
}
