var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var ListModifier = module.exports = Backbone.Model.extend({
	__name__: 'ListModifer',
	defaults: {
		"operation": null,
		"value": "",
		"guid": ""
	},

	formula: function($, renderable) {
		if(!(this.has('formula'))) {
			throw new Error("ListModifier Has no formula");
		}
		this.formula = Function("$", "renderable", "return " + this.get("formula"));
		return this.formula($, renderable);
	}
});
