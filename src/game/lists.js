var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');
var JSONPath = require('JSONPath');

var Api = require('../api.js');
var ListModifier = require("../models/list_modifier.js");
var ListVar = require("../models/list.js");
var Utils = require('../game/utils.js');

function createModifier(renderable, section, context, apply) {
	var mod = Utils.deepClone(apply);
	mod.value = getValue(renderable, apply);
	mod.guid = section.guid;
	mod.context = context;
	return new ListModifier(mod);
}

var getList = module.exports.getList = function(renderable, context, name) {
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

var recalculateList = module.exports.recalculateList = function(renderable, list) {
	var total = 0;
	_.each(list.get('modifiers'), function(modifier) {
		var value = getValue(renderable, modifier);
		modifier.set('value', value);
		var newlist = ListVar.addModifier(list.get('value'), modifier);
		list.set('value', newlist);
	});
}

module.exports.apply = function(renderable, section, applications, context) {
	if("lists" in applications) {
		_.each(applications.lists, function(listApply) {
			var modifier = createModifier(renderable, section, context, listApply);
			var list = getList(renderable, context, listApply.get('variable'))
			var value = ListVar.addModifier(list.get('value'), modifier);
			list.set('value', value);
			list.get('modifiers').push(modifier);
		});
	}
}
