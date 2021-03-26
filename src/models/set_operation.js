var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var SetOperation = module.exports = Backbone.Model.extend({
	__name__: 'SetOperation',

	initialize: function() {
		if (this.get("formula") != "") {
			this.formula = Function("$", "renderable", "return " + this.get("formula"));
		}
	}
});

