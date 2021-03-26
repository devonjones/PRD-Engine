var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var Condition = module.exports = Backbone.Model.extend({
	__name__: 'Condition',

	initialize: function() {
		if (this.has("formula")) {
			this.formula = Function("$", "renderable", "return " + this.get("formula"));
		}
	}
});


