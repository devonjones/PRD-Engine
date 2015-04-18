var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var Modifier = module.exports = Backbone.Model.extend({
	__name__: 'Modifier',
	defaults: {
		"value": 0,
		"guid": "",
		"formula": ""
	},

	formula: function($, renderable) {
		this.formula = Function("$", "renderable", "return " + this.get("formula"));
		return this.formula($, renderable);
	}
});
