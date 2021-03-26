var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var Variable = require('./variable.js');
var GameObject = require('./game_object.js');

var Spell = module.exports = GameObject.extend({
	__name__: 'Spell',
	__variables__: {},
	defaults: {
		"description": "",
		"school": "",
		"subschool_text": "",
		"subschools": [],
		"descriptor_text": "",
		"descriptors": [],
		"level_text": "",
		"level": [],
		"component_text": "",
		"components": [],
		"casting_time": "",
		"preparation_time": "",
		"range": "",
		"duration": "",
		"saving_throw": "",
		"spell_resistance": "",
		"effects": []
	},
});


