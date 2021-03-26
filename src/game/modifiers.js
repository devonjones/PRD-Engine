var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var Variables = require('./variables.js');

module.exports.apply = function(renderable, section, applications, context) {
	if("modifiers" in applications) {
		_.each(applications.modifiers, function(modApply) {
			var variable = Variables.getVariable(renderable, context, modApply.get('variable'));
			if(variable) {
				Variables.updateVariable(renderable, context, modApply, section.guid);
			}
		});
	}
}
