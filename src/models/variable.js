var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var Utils = require('../game/utils.js');

var Variable = module.exports = Backbone.Model.extend({
	__name__: 'Variable',
	defaults: {
		"default": "",
		"value": null
	},

	initialize: function() {
		if(!(this.has('formula')) || this.get('formula') == null) {
			if (this.has('value') && this.get('value') != null) {
				this.set('formula', "'" + this.get("value") + "'");
			}
		}
	},

	getValue: function() {
		throw new Error("Abstract class: getValue should have been overridden");
	},

	formula: function($, renderable) {
		if(!(this.has('formula'))) {
			throw new Error(this.get('variable') + " Has no formula");
		}
		this.formula = Function("$", "renderable", "return " + this.get("formula"));
		return this.formula($, renderable);
	}
});
