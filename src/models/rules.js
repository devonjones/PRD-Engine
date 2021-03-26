var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');
var GameObject = require('../models/game_object.js');
var Utils = require('../game/utils.js');

var RulesObject = Backbone.Model.extend({
	__name__: 'Rules',
	defaults: {
		rules: {}
	},

	addRule: function(gameObj) {
		this.get('rules')[gameObj.get('url')] = gameObj;
	},

	getRule: function(url) {
		if (url.indexOf('?') >-1) {
			var newurl = url.split('?')[0];
			var rule = new GameObject(Utils.deepClone(this.get('rules')[newurl]));
			rule.set('url', url);
			return rule;
		}
		return new GameObject(Utils.deepClone(this.get('rules')[url]));
	},

	hasRule: function(url) {
		if (url.indexOf('?') >-1) {
			var newurl = url.split('?')[0];
			if (newurl in this.get('rules')) {
				return true
			}
		}
		return (url in this.get('rules'));
	}
});

module.exports = new RulesObject();
