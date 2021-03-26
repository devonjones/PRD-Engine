var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var GameObject = require('../models/game_object.js');
var Rules = require('../models/rules.js');

// Creating Magic Weapons
Rules.addRule(new GameObject({
	"body": "<p>To create a magic weapon, a character needs a heat source and some iron, wood, or leatherworking tools. She also needs a supply of materials, the most obvious being the weapon or the pieces of the weapon to be assembled. Only a masterwork weapon can become a magic weapon, and the masterwork cost is added to the total cost to determine final market value. Additional magic supplies costs for the materials are subsumed in the cost for creating the magic weapon&mdash;half the base price of the item based upon the item's total effective bonus.</p><p>Creating a magic weapon has a special prerequisite: The creator's caster level must be at least three times the enhancement bonus of the weapon. If an item has both an enhancement bonus and a special ability, the higher of the two caster level requirements must be met. A magic weapon must have at least a +1 enhancement bonus to have any melee or ranged special weapon abilities.</p><p>If spells are involved in the prerequisites for making the weapon, the creator must have prepared the spells to be cast (or must know the spells, in the case of a sorcerer or bard) but need not provide any material components or focuses the spells require. The act of working on the weapon triggers the prepared spells, making them unavailable for casting during each day of the weapon's creation. (That is, those spell slots are expended from the caster's currently prepared spells, just as if they had been cast.)</p><p>At the time of creation, the creator must decide if the weapon glows or not as a side-effect of the magic imbued within it. This decision does not affect the price or the creation time, but once the item is finished, the decision is binding.</p><p>Creating magic double-headed weapons is treated as creating two weapons when determining cost, time, and special abilities.</p><p>Creating some weapons may entail other prerequisites beyond or other than spellcasting. See the individual descriptions for details.</p><p>Crafting a magic weapon requires 1 day for each 1,000 gp value of the base price.</p><p><b>Item Creation Feat Required</b>: Craft Magic Arms and Armor.</p><p><b>Skill Used in Creation</b>: Spellcraft, Craft (bows) (for magic bows and arrows), or Craft (weapons) (for all other weapons).</p>", 
	"name": "Creating Magic Weapons", 
	"url": "pfsrd://Core Rulebook/Rules/Magic Items/Magic Item Creation/Creating Magic Weapons", 
	"type": "section", 
	"source": "Core Rulebook",
	"apply": {
		"enchantment": {
			"variables": [
				{"variable": "caster_level", "type": "number"},
				{"variable": "skill", "type": "list"},
				{"variable": "requirements", "type": "list"}
			],
			"lists": [
				{"variable": "skill", "operation": "push", "value": ["Spellcraft", "Craft (weapons)", "Craft (bows)"]},
				{"variable": "requirements", "operation": "push", "value": {"type": "feat", "name": "Craft Magic Arms and Armor"}}
			]
		}
	}
}));

//Magic Plus
Rules.addRule(new GameObject({
	"body": "<p>A magic weapon is enhanced to strike more truly and deliver more damage. Magic weapons have enhancement bonuses ranging from +1 to +5. They apply these bonuses to both attack and damage rolls when used in combat. All magic weapons are also masterwork weapons, but their masterwork bonuses on attack rolls do not stack with their enhancement bonuses on attack rolls.</p><p>Weapons come in two basic categories: melee and ranged. Some of the weapons listed as melee weapons can also be used as ranged weapons. In this case, their enhancement bonuses apply to both melee and ranged attacks.</p><p>Some magic weapons have special abilities. Special abilities count as additional bonuses for determining the market value of the item, but do not modify attack or damage bonuses (except where specifically noted). A single weapon cannot have a modified bonus (enhancement bonus plus special ability bonus equivalents, including those from character abilities and spells) higher than +10. A weapon with a special ability must also have at least a +1 enhancement bonus. Weapons cannot possess the same special ability more than once.</p><p>Weapons or ammunition can be made of an unusual material. Roll d%: 01&ndash;95 indicates that the item is of a standard sort, and 96&ndash;100 indicates that it is made of a special material (see Equipment).</p>",
	"name": "Weapons", 
	"url": "pfsrd://Core Rulebook/Rules/Magic Items/Weapons", 
	"source": "Core Rulebook", 
	"type": "section",
	"dependencies": [
		"pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Caster Level for Weapons", 
		"pfsrd://Core Rulebook/Rules/Magic Items/Magic Item Creation/Creating Magic Weapons", 
		"pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Table Weapons", 
		"pfsrd://Core Rulebook/Rules/Magic Items/Magic Items/Magic Items and Detect Magic/Item Nature",
		"pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Hardness and Hit Points"
	],
	"apply": {
		"enchantment": {
			"context": true,
			"variables": [
				{"variable": "base_plus", "type": "number"},
				{"variable": "plus", "type": "number"},
				{"variable": "effective_plus", "type": "number"}
			],
			"modifiers": [
				{"variable": "plus", "formula": "$.getVariable(renderable, this, '$.enchantment.base_plus')"},
				{"variable": "effective_plus", "formula": "$.getVariable(renderable, this, '$.enchantment.base_plus')"},
			]
		},
		"section": {
			"sets": [
				{"variable": "tags", "operation": "union", "value": [
						"Magic",
						"Magic.Plus"
				]}
			],
			"lists": [
				{"variable": "name", "operation": "remove", "value": "Masterwork"},
				{"variable": "name", "operation": "unshift", "formula": "'+' + $.getVariable(renderable, this, '$.enchantment.plus');"}
			]
		},
		"weapon": {
			"conditions": [
				{
					"text": "Must be masterwork",
					"formula": "$.hasTag(renderable, 'Masterwork')"
				}
			],
			"sets": [
				{"variable": "type", "operation": "add", "value": "magic"}
			],
			"modifiers": [
				{"variable": "to_hit_modifier", "formula": "$.getVariable(renderable, this, '$.enchantment.plus')", "type": "enhancement"},
				{"variable": "damage_modifier", "formula": "$.getVariable(renderable, this, '$.enchantment.plus')", "type": "enhancement"}
			]
		}
	}
}));

// Caster Level
Rules.addRule(new GameObject({
	"body": "<p>The caster level of a weapon with a special ability is given in the item description. For an item with only an enhancement bonus and no other abilities, the caster level is three times the enhancement bonus. If an item has both an enhancement bonus and a special ability, the higher of the two caster level requirements must be met.</p>", 
	"url": "pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Caster Level for Weapons", 
	"type": "section", 
	"name": "Caster Level for Weapons", 
	"source": "Core Rulebook",
	"apply": {
		"weapon": {
			"modifiers": [
				{"variable": "$.enchantment.caster_level", "formula": "$.getVariable(renderable, this, '$.enchantment.plus') * 3", "type": "caster_level"}
			]
		}
	}
}));

// Magic HP/Hardness
Rules.addRule(new GameObject({
	"body": "<p>Each +1 of a magic weapon's enhancement bonus adds +2 to its hardness and +10 to its hit points.</p>",
	"url": "pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Hardness and Hit Points",
	"type": "section",
	"name": "Hardness and Hit Points",
	"source": "Core Rulebook",
	"apply": {
		"weapon": {
			"modifiers": [
				{"variable": "$.item.hardness", "formula": "$.getVariable(renderable, this, '$.enchantment.plus') * 2"},
				{"variable": "$.item.hit_points", "formula": "$.getVariable(renderable, this, '$.enchantment.plus') * 10"}
			]
		}
	}
}));

// Magic Aura
Rules.addRule(new GameObject({
	"body": "<table><thead><tr><th>Item Nature</th><th>School</th></tr></thead><tbody><tr class=\"odd\"><td>Armor and protection items</td><td>Abjuration</td></tr><tr class=\"even\"><td>Weapons or offensive items</td><td>Evocation</td></tr><tr class=\"odd\"><td>Bonus to ability score, skill check, etc.</td><td>Transmutation</td></tr></tbody></table>", 
	"name": "Item Nature", 
	"url": "pfsrd://Core Rulebook/Rules/Magic Items/Magic Items/Magic Items and Detect Magic/Item Nature", 
	"source": "Core Rulebook", 
	"type": "table",
	"dependencies": [
	],
	"apply": {
		"enchantment": {
			"variables": [
				{"variable": "aura", "type": "list"},
			]
		},
		"armor": {
			"lists": [
				{"variable": "$.enchantment.aura", "operation": "push",
					"value": {"aura": "Abjuration"}},
			]
		},
		"weapon": {
			"lists": [
				{"variable": "$.enchantment.aura", "operation": "push",
					"value": {"aura": "Transmutation"}}
			]
		}
	}
}));

// Magic Weapon Cost
Rules.addRule(new GameObject({
	"body": "<table id=\"table-15-8-weapons\"><caption>Table: Weapons</caption><thead><tr><th>Minor</th><th>Medium</th><th>Major</th><th>Weapon</th><th>Bonus Base Price<sup>1</sup></th></tr></thead><tr class=\"odd\"><td>01&ndash;70</td><td>01&ndash;10</td><td>&mdash;</td><td>+1</td><td>2,000 gp</td></tr><tr class=\"even\"><td>71&ndash;85</td><td>11&ndash;29</td><td>&mdash;</td><td>+2</td><td>8,000 gp</td></tr><tr class=\"odd\"><td>&mdash;</td><td>30&ndash;58</td><td>01&ndash;20</td><td>+3</td><td>18,000 gp</td></tr><tr class=\"even\"><td>&mdash;</td><td>59&ndash;62</td><td>21&ndash;38</td><td>+4</td><td>32,000 gp</td></tr><tr class=\"odd\"><td>&mdash;</td><td>&mdash;</td><td>39&ndash;49</td><td>+5</td><td>50,000 gp</td></tr><tr class=\"even\"><td>&mdash;</td><td>&mdash;</td><td>&mdash;</td><td>+6<sup>2</sup></td><td>72,000 gp</td></tr><tr class=\"odd\"><td>&mdash;</td><td>&mdash;</td><td>&mdash;</td><td>+7<sup>2</sup></td><td>98,000 gp</td></tr><tr class=\"even\"><td>&mdash;</td><td>&mdash;</td><td>&mdash;</td><td>+8<sup>2</sup></td><td>128,000 gp</td></tr><tr class=\"odd\"><td>&mdash;</td><td>&mdash;</td><td>&mdash;</td><td>+9<sup>2</sup></td><td>162,000 gp</td></tr><tr class=\"even\"><td>&mdash;</td><td>&mdash;</td><td>&mdash;</td><td>+10<sup>2</sup></td><td>200,000 gp</td></tr><tr class=\"odd\"><td>86&ndash;90</td><td>63&ndash;68</td><td>50&ndash;63</td><td style=\"white-space:normal;\">Specific weapon<sup>3</sup></td><td>&mdash;</td></tr><tr class=\"even\"><td>91&ndash;100</td><td>69&ndash;100</td><td>64&ndash;100</td><td style=\"white-space:normal;\">Special ability and roll again<sup>4</sup></td><td>&mdash;</td></tr><tfoot><tr><td colspan=\"5\">1 For ammunition, this price is for 50 arrows, bolts, or bullets.</td></tr><tr><td colspan=\"5\">2 A weapon can't have an enhancement bonus higher than +5. Use these lines to determine price when special abilities are added in.</td></tr><tr><td colspan=\"5\">3 See Table: Specific Weapons.</td></tr><tr><td colspan=\"5\">4 See Table: Melee Weapon Special Abilities for melee weapons and Table: Ranged Weapon Special Abilities for ranged weapons.</td></tr></tfoot></table>", 
	"name": "Table: Weapons", 
	"url": "pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Table Weapons", 
	"source": "Core Rulebook", 
	"type": "table",
	"dependencies": [
	],
	"apply": {
		"item": {
			"modifiers": [
				{"variable": "cost", "formula": "$.getVariable(renderable, this, '$.enchantment.cost')"}
			]
		},
		"enchantment": {
			"variables": [
				{"variable": "cost", "type": "number"}
			],
			"modifiers": [
				{"variable": "cost", "formula": "$.Weapon.magicCostPlus($.getVariable(renderable, this, '$.enchantment.effective_plus'))"}
			]
		}
	}
}));

// Magic Weapon Special Ability Descriptions
Rules.addRule(new GameObject({
	"body": "<p>A weapon with a special ability must also have at least a +1 enhancement bonus.</p>",
	"name": "Magic Weapon Special Ability Descriptions",
	"url": "pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Magic Weapon Special Ability Descriptions",
	"source": "Core Rulebook",
	"type": "section",
	"dependencies": [
	],
	"apply": {
		"weapon": {
			"conditions": [
				{
					"text": "Must be have at least a +1 enhancement bonus",
					"formula": "$.hasTag(renderable, 'Magic.Plus')"
				}
			]
		}
	}
}));

