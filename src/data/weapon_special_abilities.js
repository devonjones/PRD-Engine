var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var GameObject = require('../models/game_object.js');
var Rules = require('../models/rules.js');

// Keen
Rules.addRule(new GameObject({
	"body": "<p id=\"weapons-keen\">This ability doubles the threat range of a weapon. Only piercing or slashing melee weapons can be <i>keen</i>. If you roll this property randomly for an inappropriate weapon, reroll. This benefit doesn't stack with any other effect that expands the threat range of a weapon (such as the <i>keen edge</i> spell or the Improved Critical feat).</p><p>Moderate transmutation; CL 10th; Craft Magic Arms and Armor, <i>keen edge</i>; Price +1 bonus.</p>",
	"name": "Keen",
	"url": "pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Magic Weapon Special Ability Descriptions/Keen",
	"source": "Core Rulebook",
	"type": "section",
	"dependencies": [
		"pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Magic Weapon Special Ability Descriptions"
	],
	"apply": {
		"enchantment": {
			"modifiers": [
				{"variable": "effective_plus", "formula": "1"},
				{"variable": "caster_level", "formula": "10", "type": "caster_level"}
			],
			"lists": [
				{"variable": "aura", "operation": "push",
					"value": {"strength": "Moderate", "aura": "Transmutation"}},
				{"variable": "requirements", "operation": "push", "value": {"type": "spell", "name": "Keen Edge"}}
			]
		},
		"section": {
			"sets": [
				{"variable": "tags", "operation": "add", "value": "Keen"}
			],
			"lists": [
				{"variable": "name", "operation": "insert", "value": "Keen"}
			]
		},
		"weapon": {
			"conditions": [
				{
					"text": "Can only be added to weapons with a +1 enchantment",
					"formula": "$.hasTag(renderable, 'Magic.Plus')"
				}
			],
			"modifiers": [
				{"variable": "crit_range", "formula": "$.getVariable(renderable, this, '$.weapon.crit_range')", "bonus_type": "keen"}
			]
		}
	}
}));

// Flaming
Rules.addRule(new GameObject({
	"body": "<p id=\"weapons-flaming\">Upon command, a <i>flaming weapon</i> is sheathed in fire that deals an extra 1d6 points of fire damage on a successful hit. The fire does not harm the wielder. The effect remains until another command is given. </p><p>Moderate evocation; CL 10th; Craft Magic Arms and Armor and <i>flame blade, flame strike</i>, or <i>fireball</i>; Price +1 bonus.</p>",
	"name": "Flaming",
	"url": "pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Magic Weapon Special Ability Descriptions/Flaming",
	"source": "Core Rulebook",
	"type": "section",
	"dependencies": [
		"pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Magic Weapon Special Ability Descriptions"
	],
	"apply": {
		"enchantment": {
			"modifiers": [
				{"variable": "effective_plus", "formula": "1"},
				{"variable": "caster_level", "formula": "10", "type": "caster_level"}
			],
			"lists": [
				{"variable": "aura", "operation": "push",
					"value": {"strength": "Moderate", "aura": "Evocation"}},
				{"variable": "requirements", "operation": "push", "value": {"type": "spell", "name": "Fireball"}}
			]
		},
		"section": {
			"sets": [
				{"variable": "tags", "operation": "add", "value": "Flaming"}
			],
			"lists": [
				{"variable": "name", "operation": "insert", "value": "Flaming"}
			]
		},
		"weapon": {
			"conditions": [
				{
					"text": "Can only be added to weapons with a +1 enchantment",
					"formula": "$.hasTag(renderable, 'Magic.Plus')"
				}
			],
			"lists": [
				{"variable": "bonus_damage", "operation": "push", "value": [
					{"damage": "1d6", "type": "flaming"}
				]}
			]
		}
	}
}));

// Holy
Rules.addRule(new GameObject({
	"body": "<p id=\"weapons-holy\">A <i>holy weapon</i> is imbued with holy power. This power makes the weapon good-aligned and thus bypasses the corresponding damage reduction. It deals an extra 2d6 points of damage against all creatures of evil alignment. It bestows one permanent negative level on any evil creature attempting to wield it. The negative level remains as long as the weapon is in hand and disappears when the weapon is no longer wielded. This negative level cannot be overcome in any way (including by <i>restoration</i> spells) while the weapon is wielded.</p><p>Moderate evocation [good]; CL 7th; Craft Magic Arms and Armor, <i>holy smite</i>, creator must be good; Price +2 bonus.</p>", 
	"url": "pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Magic Weapon Special Ability Descriptions/Holy", 
	"type": "section", 
	"name": "Holy", 
	"source": "Core Rulebook",
	"dependencies": [
		"pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Magic Weapon Special Ability Descriptions"
	],
	"apply": {
		"enchantment": {
			"modifiers": [
				{"variable": "effective_plus", "formula": "2"},
				{"variable": "caster_level", "formula": "7", "type": "caster_level"}
			],
			"lists": [
				{"variable": "aura", "operation": "push",
					"value": {"strength": "Moderate", "aura": "Evocation [Good]"}},
				{"variable": "requirements", "operation": "push", "value": {"type": "spell", "name": "Holy Smite"}}
			]
		},
		"section": {
			"sets": [
				{"variable": "tags", "operation": "add", "value": "Holy"}
			],
			"lists": [
				{"variable": "name", "operation": "insert", "value": "Holy"}
			]
		},
		"weapon": {
			"conditions": [
				{
					"text": "Can only be added to weapons with a +1 enchantment",
					"formula": "$.hasTag(renderable, 'Magic.Plus')"
				}
			],
			"sets": [
				{"variable": "type", "operation": "add", "value": "good"}
			],
			"lists": [
				{"variable": "bonus_damage", "operation": "push", "value": [
					{"damage": "2d6", "type": "vs evil"}
				]}
			]
		}
	}
}));

