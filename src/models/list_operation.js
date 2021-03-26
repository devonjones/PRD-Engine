var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var ListOperation = module.exports = Backbone.Model.extend({
	__name__: 'ListOperation',

	initialize: function() {
		if (this.get("formula") != "") {
			this.formula = Function("$", "renderable", "return " + this.get("formula"));
		}
	}
});

