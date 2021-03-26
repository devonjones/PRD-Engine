var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var GameObject = require('../models/game_object.js');
var Rules = require('../models/rules.js');

// Masterwork Weapons
Rules.addRule(new GameObject({
	"body": "<p>A masterwork weapon is a finely crafted version of a normal weapon. Wielding it provides a +1 enhancement bonus on attack rolls.</p><p>You can't add the masterwork quality to a weapon after it is created; it must be crafted as a masterwork weapon (see the Craft skill). The masterwork quality adds 300 gp to the cost of a normal weapon (or 6 gp to the cost of a single unit of ammunition). Adding the masterwork quality to a double weapon costs twice the normal increase (+600 gp).</p><p>Masterwork ammunition is damaged (effectively destroyed) when used. The enhancement bonus of masterwork ammunition does not stack with any enhancement bonus of the projectile weapon firing it.</p><p>All magic weapons are automatically considered to be of masterwork quality. The enhancement bonus granted by the masterwork quality doesn't stack with the enhancement bonus provided by the weapon's magic.</p><p>Even though some types of armor and shields can be used as weapons, you can't create a masterwork version of such an item that confers an enhancement bonus on attack rolls. Instead, masterwork armor and shields have lessened armor check penalties.</p>",
	"name": "Masterwork Weapons",
	"url": "pfsrd://Core Rulebook/Rules/Equipment/Weapons/Masterwork Weapons",
	"source": "Core Rulebook",
	"type": "section",
	"apply": {
		"section": {
			"sets": [
				{"variable": "tags", "operation": "add", "value": "Masterwork"}
			],
			"lists": [
				{"variable": "name", "operation": "unshift", "value": "Masterwork"}
			]
		},
		"item": {
			"modifiers": [
				{"variable": "cost", "formula": "300"}
			],
		},
		"weapon": {
			"modifiers": [
				{"variable": "to_hit_modifier", "formula": "1", "type": "enhancement"}
			]
		}
	}
}));

