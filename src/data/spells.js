var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var GameObject = require('../models/game_object.js');
var Rules = require('../models/rules.js');

// Blessing of Fervor
Rules.addRule(new GameObject({
	"body": "<p>With this blessing, you call your allies to move forth and empower them to conquer and become victorious. Each round for the duration of this spell, each of your allies can choose one of the following bonuses for that round at the beginning of its turn (their choice).</p><ul><li class=\"stat-description-indent\">Increase its speed by 30 feet.</li><li class=\"stat-description-indent\">Stand up as a swift action without provoking an attack of opportunity.</li><li class=\"stat-description-indent\">Make one extra attack as part of a full attack action, using its highest base attack bonus.</li><li class=\"stat-description-indent\">Gain a +2 bonus on attack rolls and a +2 dodge bonus to AC and Reflex saves.</li><li class=\"stat-description-indent\">Cast a single spell of 2nd level or lower as if it were an enlarged, extended, silent, or still spell. </li></ul><p>These effects are not cumulative with similar effects, such as those provided by <i>haste</i> or a <i>speed</i> weapon, nor do they actually grant an extra action, so you can't use it to cast a second spell or otherwise take an extra action in the round. <i>Blessing of fervor</i> does not stack with <i>haste</i>.</p>", 
	"sections": [
		{
			"description": "Increase its speed by 30 feet.",
			"url": "pfsrd://Advanced Players Guide/Spells/Blessing Of Fervor/Effect/Speed", 
			"source": "Advanced Player's Guide", 
			"type": "section", 
		},
		{
			"description": "Stand up as a swift action without provoking an attack of opportunity.",
			"url": "pfsrd://Advanced Players Guide/Spells/Blessing Of Fervor/Effect/Stand", 
			"source": "Advanced Player's Guide", 
			"type": "section", 
		},
		{
			"description": "Make one extra attack as part of a full attack action, using its highest base attack bonus.",
			"url": "pfsrd://Advanced Players Guide/Spells/Blessing Of Fervor/Effect/Extra Attack", 
			"source": "Advanced Player's Guide", 
			"type": "section", 
		},
		{
			"description": "Gain a +2 bonus on attack rolls and a +2 dodge bonus to AC and Reflex saves.",
			"url": "pfsrd://Advanced Players Guide/Spells/Blessing Of Fervor/Effect/Bonus", 
			"source": "Advanced Player's Guide", 
			"type": "section", 
		},
		{
			"description": "Cast a single spell of 2nd level or lower as if it were an enlarged, extended, silent, or still spell.", 
			"url": "pfsrd://Advanced Players Guide/Spells/Blessing Of Fervor/Effect/Spell", 
			"source": "Advanced Player's Guide", 
			"type": "section", 
		}
	],
	"school": "transmutation", 
	"saving_throw": "Fortitude negates (harmless)", 
	"description": "Gives allies a choice of benefits.", 
	"url": "pfsrd://Advanced Players Guide/Spells/Blessing Of Fervor", 
	"spell_resistance": "yes (harmless)", 
	"casting_time": "1 standard action", 
	"level_text": "Cleric: 4; Oracle: 4; Warpriest: 4", 
	"source": "Advanced Player's Guide", 
	"range": "close (25 ft. + 5 ft./2 levels)", 
	"levels": [
		{
			"class": "Cleric", 
			"level": 4
		}, 
		{
			"class": "Oracle", 
			"level": 4
		}, 
		{
			"class": "Warpriest", 
			"level": 4
		}
	], 
	"effects": [
		{
			"text": "one creature/level, no two of which can be more than 30 ft. apart", 
			"name": "Targets"
		}
	], 
	"components": [
		{
			"type": "V"
		}, 
		{
			"type": "S"
		}, 
		{
			"type": "DF"
		}
	], 
	"duration": "1 round/level", 
	"type": "spell", 
	"component_text": "V, S, DF", 
	"name": "Blessing Of Fervor"
}));

