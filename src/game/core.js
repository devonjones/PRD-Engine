var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var Utils = require('./utils.js');
var Rules = require('../models/rules.js');
var Conditions = require('./conditions.js');
var Variables = require('./variables.js');
var Lists = require('./lists.js');
var Sets = require('./sets.js');
var GameObject = require('../models/game_object.js');

var Modifiers = require('./modifiers.js');

module.exports.createRenderable = function(base) {
	var renderable = {
		"base": base.clone(),
		"applied": [],
		"history": [],
		"contexts": [
			"section",
		]
	}

	addContext(renderable, base.get('type'));
	addContext(renderable, base.get('subtype'));
	applyGameObjects(renderable, base);
	return renderable;
}

function addContext(renderable, context) {
	if(context != "") {
		if(renderable.contexts.indexOf(context) == -1) {
			renderable.contexts.push(context);
		}
	}
}

var applyGameObjects = module.exports.applyGameObjects = function() {
	var args = Array.prototype.slice.call(arguments);
	var renderable = args.shift();
	
	_.each(args, function(realobj) {
		var toApply = [];
		var gameobj = realobj.clone();
		renderable.history.push(realobj.get('url'));
		
		toApply = toApply.concat(getDependencies(gameobj));

		applyContext(renderable, toApply);
		applyConditions(renderable, toApply);
		applyVariables(renderable, toApply);
		applyLists(renderable, toApply);
		applySets(renderable, toApply);
		applyModifiers(renderable, toApply);
		applyHousekeeping(renderable, toApply);
	});
	return renderable;
}

function getDependencies(gameobj) {
	var deps = []
	gameobj.guid = Utils.guid();
	deps.push(gameobj);
	if(gameobj.has('dependencies')) {
		_.each(gameobj.get('dependencies'), function(dep) {
			deps = deps.concat(getDependencies(Rules.getRule(dep)))
		});
	}
	return deps;
}

function applyContext(renderable, toApply) {
	_.each(toApply, function(section) {
		if (section.has('apply')) {
			var apply = section.get('apply');
			_.each(apply, function(context, name) {
				if('context' in context) {
					if(context.context) {
						renderable.contexts.push(name);
					}
				}
			});
		}
	});
}

function applyConditions(renderable, toApply) {
	failures = [];
	iterateApplications(renderable, toApply, function(section, context, apply) {
		var applications = apply[context];
		var results = Conditions.apply(renderable, applications);
		if(!results.result) {
			failures = failures.concat(results.failed);
		}
	});
	if (failures.length > 0) {
		throw new Error("Failed to apply: " + JSON.stringify(failures));
	}
}

function applyVariables(renderable, toApply) {
	iterateApplications(renderable, toApply, function(section, context, apply) {
		var applications = apply[context];
		Variables.apply(renderable, section, applications, context);
	});
}

function applyLists(renderable, toApply) {
	iterateApplications(renderable, toApply, function(section, context, apply) {
		var applications = apply[context];
		Lists.apply(renderable, section, applications, context);
	});
}

function applySets(renderable, toApply) {
	iterateApplications(renderable, toApply, function(section, context, apply) {
		var applications = apply[context];
		Sets.apply(renderable, section, applications, context);
	});
}

function applyModifiers(renderable, toApply) {
	iterateApplications(renderable, toApply, function(section, context, apply) {
		var applications = apply[context];
		Modifiers.apply(renderable, section, applications, context);
	});
}

function applyHousekeeping(renderable, toApply) {
	_.each(toApply, function(section) {
		renderable.applied.push(section);
	});
}

function iterateApplications(renderable, toApply, fxn) {
	_.each(toApply, function(section) {
		if (section.has('apply')) {
			var apply = section.get('apply');
			_.each(renderable.contexts, function(context) {
				if (context in apply) {
					fxn(section, context, apply);
				}
			});
		}
	});
}
