var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var Api = require('../api.js');

module.exports.apply = function(renderable, applications) {
	var results = {"result": true, "failed": []}
	if("conditions" in applications) {
		_.each(applications["conditions"], function(conditionApply) {
			if(!conditionApply.formula(Api, renderable)) {
				results.result = false;
				results.failed.push(conditionApply);
			}
		});
	}
	return results;
}

