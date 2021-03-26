var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var GameObject = require('../models/game_object.js');
var Rules = require('../models/rules.js');

// Melee
Rules.addRule(new GameObject({
	"body": "<p>Your attack bonus with a melee weapon is the following:</p><p><big><b>Base attack bonus + Strength modifier + size modifier</b></big></p>", 
	"url": "pfsrd://Core Rulebook/Rules/Combat/Combat Statistics/Attack Bonus/Melee", 
	"type": "section", 
	"name": "Melee", 
	"source": "Core Rulebook",
	"apply": {
		"wielder": {
			"context": true,
			"variables": [
				{"variable": "to_hit_stat", "type": "string", "default": "$.attributes.str_mod"},
				{"variable": "to_hit_stat_mod", "type": "number"},
				{"variable": "damage_stat", "type": "string", "default": "$.attributes.str_mod"},
				{"variable": "damage_stat_mod", "type": "number"},
				{"variable": "size", "type": "string", "default": "medium"},
				{"variable": "proficient", "type": "number", "default": 1},
				{"variable": "bab", "type": "number"},
				{"variable": "special", "type": "list"},
				{"variable": "full_attack", "type": "list"},
				{"variable": "standard_attack", "type": "list"},
				{"variable": "offhand_full_attack", "type": "list"}
			],
			"lists": [
				{"variable": "full_attack", "operation": "replace", "formula": "$.Weapon.createFullAttack($.getVariable(renderable, this, '$.wielder.bab'))"},
				{"variable": "standard_attack", "operation": "replace", "formula": "$.Weapon.createStandardAttack()"},
			],
			"modifiers": [
				{"variable": "$.weapon.to_hit_modifier", "formula": "$.getVariable(renderable, this, '$.wielder.bab')", "type": "bab"},
				{"variable": "$.weapon.to_hit_modifier", "formula": "$.getVariable(renderable, this, '$.wielder.to_hit_stat_mod')", "type": "stat"},
				{"variable": "$.weapon.to_hit_modifier", "formula": "$.Weapon.sizeToHit($.getVariable(renderable, this, '$.wielder.size'))", "type": "size"},
				{"variable": "$.weapon.damage_modifier", "formula": "$.getVariable(renderable, this, '$.wielder.damage_stat_mod')", "type": "stat"},
			]
		}
	}
}));

// Ranged
Rules.addRule(new GameObject({
	"body": "<p>With a ranged weapon, your attack bonus is the following:</p><p><big><b>Base attack bonus + Dexterity modifier + size modifier + range penalty</b></big></p>", 
	"url": "pfsrd://Core Rulebook/Rules/Combat/Combat Statistics/Attack Bonus/Ranged", 
	"type": "section", 
	"name": "Ranged",
	"source": "Core Rulebook", 
	"apply": {
		"wielder": {
			"context": true,
			"variables": [
				{"variable": "to_hit_stat", "type": "string", "default": "$.attributes.dex_mod"},
				{"variable": "to_hit_stat_mod", "type": "number"},
				{"variable": "damage_stat", "type": "string", "default": "$.attributes.str_mod"},
				{"variable": "damage_stat_mod", "type": "number"},
				{"variable": "size", "type": "string", "default": "medium"},
				{"variable": "proficient", "type": "number", "default": 1},
				{"variable": "bab", "type": "number"},
				{"variable": "special", "type": "list"},
				{"variable": "full_attack", "type": "list"},
				{"variable": "standard_attack", "type": "list"}
			],
			"lists": [
				{"variable": "full_attack", "operation": "replace", "formula": "$.Weapon.createFullAttack($.getVariable(renderable, this, '$.wielder.bab'))"},
				{"variable": "standard_attack", "operation": "replace", "formula": "$.Weapon.createStandardAttack()"},
			],
			"modifiers": [
				{"variable": "$.weapon.to_hit_modifier", "formula": "$.getVariable(renderable, this, '$.wielder.bab')", "type": "bab"},
				{"variable": "$.weapon.to_hit_modifier", "formula": "$.getVariable(renderable, this, '$.wielder.to_hit_stat_mod')", "type": "stat"},
				{"variable": "$.weapon.to_hit_modifier", "formula": "$.Weapon.sizeToHit($.getVariable(renderable, this, '$.wielder.size'))", "type": "size"},
			]
		}
	}
}));

// Change damage type (blunt arrow)
// Increase Range (flight arrow)
// Create an effect (smoke arrow, whistling arrow)
// Ammunition
Rules.addRule(new GameObject({
	"body": "<p id=\"ammunition\">Projectile weapons use ammunition: arrows (for bows), bolts (for crossbows), darts (for blowguns), or sling bullets (for slings and halfling sling staves). When using a bow, a character can draw ammunition as a free action; crossbows and slings require an action for reloading (as noted in their descriptions). Generally speaking, ammunition that hits its target is destroyed or rendered useless, while ammunition that misses has a 50% chance of being destroyed or lost.</p><p>Although they are thrown weapons, shuriken are treated as ammunition for the purposes of drawing them, crafting masterwork or otherwise special versions of them, and what happens to them after they are thrown.</p>", 
	"url": "pfsrd://Core Rulebook/Rules/Equipment/Weapons/Melee and Ranged Weapons/Ammunition", 
	"type": "section", 
	"name": "Ammunition", 
	"source": "Core Rulebook",
	"dependencies": [
		"pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Qualities/Cost",
		"pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Qualities/Weight",
		"pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Qualities/Special",
		"pfsrd://Core Rulebook/Rules/Additional Rules/Exploration/Breaking and Entering/Smashing an Object"
	],
	"apply": {
		"section": {
			"variables": [
				{"variable": "tags", "type": "set"},
				{"variable": "name", "type": "list"}
			]
		},
		"item": {
			"variables": [
				{"variable": "size", "type": "string", "default": "medium"}
			]
		},
		"weapon": {
			"variables": [
				{"variable": "bonus_damage", "type": "list"},
				{"variable": "crit_bonus_damage", "type": "list"},
				{"variable": "to_hit_modifier", "type": "number"},
				{"variable": "damage_modifier", "type": "number"}
			]
		}
	}
}));

// Weapons
Rules.addRule(new GameObject({
	"body": "<p>From the common longsword to the exotic dwarven urgrosh, weapons come in a wide variety of shapes and sizes. </p><p>All weapons deal hit point damage. This damage is subtracted from the current hit points of any creature struck by the weapon. When the result of the die roll to make an attack is a natural 20 (that is, the die actually shows a 20), this is known as a critical threat (although some weapons can score a critical threat on a roll of less than 20). If a critical threat is scored, another attack roll is made, using the same modifiers as the original attack roll. If this second attack roll is equal or greater than the target's AC, the hit becomes a critical hit, dealing additional damage.</p><p>Weapons are grouped into several interlocking sets of categories. These categories pertain to what training is needed to become proficient in a weapon's use (simple, martial, or exotic), the weapon's usefulness either in close combat (melee) or at a distance (ranged, which includes both thrown and projectile weapons), its relative encumbrance (light, one-handed, or two-handed), and its size (Small, Medium, or Large).</p>",
	"name": "Weapons",
	"url": "pfsrd://Core Rulebook/Rules/Equipment/Weapons",
	"type": "section",
	"source": "Core Rulebook",
	"dependencies": [
		"pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Qualities/Cost",
		"pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Qualities/Dmg",
		"pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Qualities/Critical",
		"pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Qualities/Range",
		"pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Qualities/Weight",
		"pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Qualities/Type",
		"pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Qualities/Special",
		"pfsrd://Core Rulebook/Rules/Additional Rules/Exploration/Breaking and Entering/Smashing an Object",
		"pfsrd://Core Rulebook/Rules/Equipment/Weapons/Simple/Martial/and Exotic Weapons",
		"pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Size", 
		"pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Size/Inappropriately Sized Weapons"
	],
	"apply": {
		"section": {
			"variables": [
				{"variable": "tags", "type": "set"},
				{"variable": "name", "type": "list"}
			]
		},
		"item": {
			"variables": [
				{"variable": "size", "type": "string", "default": "medium"}
			]
		},
		"weapon": {
			"variables": [
				{"variable": "bonus_damage", "type": "list"},
				{"variable": "crit_bonus_damage", "type": "list"},
				{"variable": "to_hit_modifier", "type": "number"},
				{"variable": "damage_modifier", "type": "number"}
			]
		}
	}
}));

// Cost
Rules.addRule(new GameObject({
	"body": "<p>This value is the weapon's cost in gold pieces (gp) or silver pieces (sp). The cost includes miscellaneous gear that goes with the weapon, such as a scabbard or quiver.</p><p>This cost is the same for a Small or Medium version of the weapon. A Large version costs twice the listed price.</p>",
	"url": "pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Qualities/Cost",
	"type": "section",
	"name": "Cost",
	"source": "Core Rulebook",
	"apply": {
		"item": {
			"variables": [
				{"variable": "cost", "type": "number"}
			],
			"modifiers": [
				{"variable": "cost", "formula": "$.getVariable(renderable, this, '$.weapon.cost')"}
			]
		},
		"weapon": {
			"variables": [
				{"variable": "cost", "type": "number"}
			],
			"modifiers": [
				{"variable": "cost", "formula": "$.Weapon.sizeCost($.getVariable(renderable, this, '$.weapon.cost'), $.getVariable(renderable, this, '$.item.size'))"}
			]
		}
	}
}));

// Damage
Rules.addRule(new GameObject({
	"body": "<p>These columns give the damage dealt by the weapon on a successful hit. The column labeled &ldquo;Dmg (S)&rdquo; is for Small weapons. The column labeled &ldquo;Dmg (M)&rdquo; is for Medium weapons. If two damage ranges are given, then the weapon is a double weapon. Use the second damage figure given for the double weapon's extra attack. Table: Tiny and Large Weapon Damage gives weapon damage values for Tiny and Large weapons.</p>",
	"name": "Dmg",
	"url": "pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Qualities/Dmg",
	"type": "section",
	"source": "Core Rulebook",
	"apply": {
		"weapon": {
			"variables": [
				{"variable": "medium_damage", "type": "string", "default": "-"},
				{"variable": "damage", "type": "string", "default": "-"}
			],
			"modifiers": [
				{"variable": "damage", "formula": "$.Weapon.sizeDamage($.getVariable(renderable, this, '$.weapon.medium_damage'), $.getVariable(renderable, this, '$.item.size'))"}
			]
		}
	}
}));

// Critical
Rules.addRule(new GameObject({
	"body": "<p>The entry in this column notes how the weapon is used with the rules for critical hits. When your character scores a critical hit, roll the damage two, three, or four times, as indicated by its critical multiplier (using all applicable modifiers on each roll), and add all the results together.</p><p>Extra damage over and above a weapon's normal damage is not multiplied when you score a critical hit.</p><p>&times;<i>2</i>The weapon deals double damage on a critical hit.</p><p>&times;<i>3</i>The weapon deals triple damage on a critical hit.</p><p>&times;<i>3/</i>&times;<i>4</i>One head of this double weapon deals triple damage on a critical hit. The other head deals quadruple damage on a critical hit.</p><p>&times;<i>4</i>The weapon deals quadruple damage on a critical hit.</p><p>19-20/&times;<i>2</i>The weapon scores a threat on a natural roll of 19 or 20 (instead of just 20) and deals double damage on a critical hit. </p><p>18-20/&times;<i>2</i>The weapon scores a threat on a natural roll of 18, 19, or 20 (instead of just 20) and deals double damage on a critical hit. </p>",
	"url": "pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Qualities/Critical",
	"type": "section",
	"name": "Critical",
	"source": "Core Rulebook",
	"apply": {
		"weapon": {
			"variables": [
				{"variable": "crit_range", "type": "number", "default": 1},
				{"variable": "crit_mult", "type": "number", "default": 1},
				{"variable": "crit_confirm_modifier", "type": "number"},
				{"variable": "crit_damage_modifier", "type": "number"},
				{"variable": "crit_special", "type": "list"}
			]
		}
	}
}));

// Range
Rules.addRule(new GameObject({
	"body": "<p>Any attack at more than this distance is penalized for range. Beyond this range, the attack takes a cumulative &ndash;2 penalty for each full range increment (or fraction thereof) of distance to the target. For example, a dagger (with a range of 10 feet) thrown at a target that is 25 feet away would incur a &ndash;4 penalty. A thrown weapon has a maximum range of five range increments. A projectile weapon can shoot to 10 range increments.</p>",
	"url": "pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Qualities/Range",
	"type": "section",
	"name": "Range",
	"source": "Core Rulebook",
	"apply": {
		"weapon": {
			"variables": [
				{"variable": "range", "type": "number"},
				{"variable": "range_penalty", "type": "number", "default": -2}
			]
		}
	}
}));

// Weight
Rules.addRule(new GameObject({
	"body": "<p>This column gives the weight of a Medium version of the weapon. Halve this number for Small weapons and double it for Large weapons. Some weapons have a special weight. See the weapon's description for details.</p>",
	"url": "pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Qualities/Weight",
	"type": "section",
	"name": "Weight",
	"source": "Core Rulebook",
	"apply": {
		"item": {
			"variables": [
				{"variable": "weight", "type": "number"}
			]
		},
		"weapon": {
			"modifiers": [
				{"variable": "$.item.weight", "formula": "$.Weapon.sizeWeight($.getVariable(renderable, this, '$.item.weight'), $.getVariable(renderable, this, '$.item.size'))"}
			]
		}
	}
}));

// Type
Rules.addRule(new GameObject({
	"body": "<p>Weapons are classified according to the type of damage they deal: B for bludgeoning, P for piercing, or S for slashing. Some monsters may be resistant or immune to attacks from certain types of weapons.</p><p>Some weapons deal damage of multiple types. If a weapon causes two types of damage, the type it deals is not half one type and half another; all damage caused is of both types. Therefore, a creature would have to be immune to both types of damage to ignore any of the damage caused by such a weapon.</p><p>In other cases, a weapon can deal either of two types of damage. In a situation where the damage type is significant, the wielder can choose which type of damage to deal with such a weapon.</p>",
	"url": "pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Qualities/Type",
	"type": "section",
	"name": "Type",
	"source": "Core Rulebook",
	"apply": {
		"weapon": {
			"variables": [
				{"variable": "type", "type": "set"},
			]
		}
	}
}));

// Special
Rules.addRule(new GameObject({
	"body": "<p>Some weapons have special features in addition to those noted in their descriptions. </p>",
	"name": "Special",
	"url": "pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Qualities/Special",
	"type": "section",
	"source": "Core Rulebook",
	"apply": {
		"weapon": {
			"variables": [
				{"variable": "special", "type": "list"}
			]
		}
	}
}));

// Proficiency
Rules.addRule(new GameObject({
	"body": "<p id=\"simple-martial-and-exotic-weapons\">Anybody but a druid, monk, or wizard is proficient with all simple weapons. Barbarians, fighters, paladins, and rangers are proficient with all simple and all martial weapons. Characters of other classes are proficient with an assortment of simple weapons and possibly some martial or even exotic weapons. All characters are proficient with unarmed strikes and any natural weapons possessed by their race. A character who uses a weapon with which he is not proficient takes a &ndash;4 penalty on attack rolls.</p>", 
	"url": "pfsrd://Core Rulebook/Rules/Equipment/Weapons/Simple/Martial/and Exotic Weapons", 
	"type": "section", 
	"name": "Simple, Martial, and Exotic Weapons", 
	"source": "Core Rulebook",
	"apply": {
		"wielder": {
			"modifiers": [
				{"variable": "$.weapon.to_hit_modifier", "formula": "$.getVariable(renderable, this, '$.wielder.proficient') < 1 ? -4 : 0", "type": "proficiency"}
			]
		},
		"weapon": {
			"variables": [
				{"variable": "proficiency", "type": "set"}
			]
		}
	}
}));

// Smashing an object
Rules.addRule(new GameObject({
	"body": "<p>Smashing a weapon or shield with a slashing or bludgeoning weapon is accomplished with the sunder combat maneuver (see Combat). Smashing an object is like sundering a weapon or shield, except that your combat maneuver check is opposed by the object's AC. Generally, you can smash an object only with a bludgeoning or slashing weapon.</p><p>Armor Class: Objects are easier to hit than creatures because they don't usually move, but many are tough enough to shrug off some damage from each blow. An object's Armor Class is equal to 10 + its size modifier (see Table: Size and Armor Class of Objects) + its Dexterity modifier. An inanimate object has not only a Dexterity of 0 (&ndash;5 penalty to AC), but also an additional &ndash;2 penalty to its AC. Furthermore, if you take a full-round action to line up a shot, you get an automatic hit with a melee weapon and a +5 bonus on attack rolls with a ranged weapon.</p><p>Hardness: Each object has hardness&mdash;a number that represents how well it resists damage. When an object is damaged, subtract its hardness from the damage. Only damage in excess of its hardness is deducted from the object's hit points (see Table: Common Armor, Weapon, and Shield Hardness and Hit Points, Table: Substance Hardness and Hit Points, and Table: Object Hardness and Hit Points).</p><p>Hit Points: An object's hit point total depends on what it is made of and how big it is (see Table: Common Armor, Weapon, and Shield Hardness and Hit Points, Table: Substance Hardness and Hit Points, and Table: Object Hardness and Hit Points). Objects that take damage equal to or greater than half their total hit points gain the broken condition (see Conditions). When an object's hit points reach 0, it's ruined.</p><p>Very large objects have separate hit point totals for different sections.</p><p>Energy Attacks: Energy attacks deal half damage to most objects. Divide the damage by 2 before applying the object's hardness. Some energy types might be particularly effective against certain objects, subject to GM discretion. For example, fire might do full damage against parchment, cloth, and other objects that burn easily. Sonic might do full damage against glass and crystal objects.</p><p>Ranged Weapon Damage: Objects take half damage from ranged weapons (unless the weapon is a siege engine or something similar). Divide the damage dealt by 2 before applying the object's hardness.</p><p>Ineffective Weapons: Certain weapons just can't effectively deal damage to certain objects. For example, a bludgeoning weapon cannot be used to damage a rope. Likewise, most melee weapons have little effect on stone walls and doors, unless they are designed for breaking up stone, such as a pick or hammer.</p><p>Immunities: Objects are immune to nonlethal damage and to critical hits.</p><p>Magic Armor, Shields, and Weapons: Each +1 of enhancement bonus adds 2 to the hardness of armor, a weapon, or a shield, and +10 to the item's hit points.</p><p>Vulnerability to Certain Attacks: Certain attacks are especially successful against some objects. In such cases, attacks deal double their normal damage and may ignore the object's hardness.</p><p>Damaged Objects: A damaged object remains functional with the broken condition until the item's hit points are reduced to 0, at which point it is destroyed.</p><p>Damaged (but not destroyed) objects can be repaired with the Craft skill and a number of spells.</p><p>Saving Throws: Nonmagical, unattended items never make saving throws. They are considered to have failed their saving throws, so they are always fully affected by spells and other attacks that allow saving throws to resist or negate. An item attended by a character (being grasped, touched, or worn) makes saving throws as the character (that is, using the character's saving throw bonus).</p><p>Magic items always get saving throws. A magic item's Fortitude, Reflex, and Will save bonuses are equal to 2 + half its caster level. An attended magic item either makes saving throws as its owner or uses its own saving throw bonus, whichever is better.</p><p>Animated Objects: Animated objects count as creatures for purposes of determining their Armor Class (do not treat them as inanimate objects).</p>", 
	"name": "Smashing an Object", 
	"url": "pfsrd://Core Rulebook/Rules/Additional Rules/Exploration/Breaking and Entering/Smashing an Object", 
	"source": "Core Rulebook", 
	"type": "section",
	"dependencies": [
		"pfsrd://Core Rulebook/Rules/Additional Rules/Exploration/Breaking and Entering/Table Size and Armor Class of Objects",
		"pfsrd://Core Rulebook/Rules/Additional Rules/Exploration/Breaking and Entering/Breaking Items/Table Common Armor/Weapon/and Shield Hardness and Hit Points"
	],
	"apply": {
		"item": {
			"modifiers": [
				{"variable": "$.item.armor_class", "formula": "-5", "type": "dex_mod"},
				{"variable": "$.item.armor_class", "formula": "-2"},
			]
		}
	}
}));

// Weapon HP/Hardness
Rules.addRule(new GameObject({
	"body": "<table id=\"table-7-12-common-armor-weapon-and-shield-hardness-and-hit-points\"><caption>Table: Common Armor, Weapon, and Shield Hardness and Hit Points</caption><thead><tr><th>Weapon or Shield</th><th>Hardness<sup>1</sup></th><th>Hit Points<sup>2, 3</sup></th></tr></thead><tr class=\"odd\"><td>Light blade</td><td>10</td><td>2</td></tr><tr class=\"even\"><td>One-handed blade</td><td>10</td><td>5</td></tr><tr class=\"odd\"><td>Two-handed blade</td><td>10</td><td>10</td></tr><tr class=\"even\"><td>Light metal-hafted weapon</td><td>10</td><td>10</td></tr><tr class=\"odd\"><td>One-handed metal-hafted weapon</td><td>10</td><td>20</td></tr><tr class=\"even\"><td>Light hafted weapon</td><td>5</td><td>2</td></tr><tr class=\"odd\"><td>One-handed hafted weapon</td><td>5</td><td>5</td></tr><tr class=\"even\"><td>Two-handed hafted weapon</td><td>5</td><td>10</td></tr><tr class=\"odd\"><td>Projectile weapon</td><td>5</td><td>5</td></tr><tr class=\"even\"><td>Armor</td><td>special<sup>4</sup></td><td>armor bonus \u00d7 5</td></tr><tr class=\"odd\"><td>Buckler</td><td>10</td><td>5</td></tr><tr class=\"even\"><td>Light wooden shield</td><td>5</td><td>7</td></tr><tr class=\"odd\"><td>Heavy wooden shield</td><td>5</td><td>15</td></tr><tr class=\"even\"><td>Light steel shield</td><td>10</td><td>10</td></tr><tr class=\"odd\"><td>Heavy steel shield</td><td>10</td><td>20</td></tr><tr class=\"even\"><td>Tower shield</td><td>5</td><td>20</td></tr><tfoot><tr><td colspan=\"3\"><sup>1</sup> Add +2 for each +1 enhancement bonus of magic items.</td></tr><tr><td colspan=\"3\"><sup>2</sup> The hp value given is for Medium armor, weapons, and shields. Divide by 2 for each size category of the item smaller than Medium, or multiply it by 2 for each size category larger than Medium.</td></tr><tr><td colspan=\"3\"><sup>3</sup> Add 10 hp for each +1 enhancement bonus of magic items.</td></tr><tr><td colspan=\"3\"><sup>4</sup> Varies by material; see Table: Substance Hardness and Hit Points.</td></tr></tfoot></table>",
	"name": "Table: Common Armor, Weapon, and Shield Hardness and Hit Points",
	"url": "pfsrd://Core Rulebook/Rules/Additional Rules/Exploration/Breaking and Entering/Breaking Items/Table Common Armor/Weapon/and Shield Hardness and Hit Points",
	"source": "Core Rulebook",
	"type": "table",
	"apply": {
		"item": {
			"variables": [
				{"variable": "hit_points", "type": "number"},
				{"variable": "hardness", "type": "number"},
			],
		},
		"weapon": {
			"modifiers": [
				{"variable": "$.item.hit_points", "formula": "$.Weapon.hitPoints(renderable, $.getVariable(renderable, this, '$.item.size'))"},
				{"variable": "$.item.hardness", "formula": "$.Weapon.hardness(renderable, $.getVariable(renderable, this, '$.item.size'))"},
			]
		}
	}
}));

// Item AC Size
Rules.addRule(new GameObject({
	"body": "<table id=\"table-7-11-size-and-armor-class-of-objects\"><caption>Table: Size and Armor Class of Objects</caption><thead><tr><th>Size</th><th>AC Modifier</th></tr></thead><tbody><tr class=\"odd\"><td>Colossal</td><td>&ndash;8</td></tr><tr class=\"even\"><td>Gargantuan</td><td>&ndash;4</td></tr><tr class=\"odd\"><td>Huge</td><td>&ndash;2</td></tr><tr class=\"even\"><td>Large</td><td>&ndash;1</td></tr><tr class=\"odd\"><td>Medium</td><td>+0</td></tr><tr class=\"even\"><td>Small</td><td>+1</td></tr><tr class=\"odd\"><td>Tiny</td><td>+2</td></tr><tr class=\"even\"><td>Diminutive</td><td>+4</td></tr><tr class=\"odd\"><td>Fine</td><td>+8</td></tr></tbody></table>",
	"name": "Table: Size and Armor Class of Objects",
	"url": "pfsrd://Core Rulebook/Rules/Additional Rules/Exploration/Breaking and Entering/Table Size and Armor Class of Objects",
	"source": "Core Rulebook",
	"type": "table",
	"apply": {
		"item": {
			"variables": [
				{"variable": "armor_class", "type": "number", "default": 10}
			],
			"modifiers": [
				{"variable": "$.item.armor_class", "formula": "$.Item.acSize($.getVariable(renderable, this, '$.item.size'))", "type": "size"},
			]
		}
	}
}));

// Wield Category
Rules.addRule(new GameObject({
	"body": "<p id=\"weapon-size\">Every weapon has a size category. This designation indicates the size of the creature for which the weapon was designed.</p><p>A weapon's size category isn't the same as its size as an object. Instead, a weapon's size category is keyed to the size of the intended wielder. In general, a light weapon is an object two size categories smaller than the wielder, a one-handed weapon is an object one size category smaller than the wielder, and a two-handed weapon is an object of the same size category as the wielder.</p>", 
	"name": "Weapon Size", 
	"url": "pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Size", 
	"type": "section", 
	"source": "Core Rulebook",
	"apply": {
		"wielder": {
			"variables": [
				{"variable": "effective_wield_category", "type": "string"}
			],
			"modifiers": [
				{"variable": "effective_wield_category", "formula": "$.Weapon.wielderWieldCategory($.getVariable(renderable, this, '$.weapon.wield_category'), $.getVariable(renderable, this, '$.wielder.size'), $.getVariable(renderable, this, '$.item.size'))"},
			]
		},
		"weapon": {
			"variables": [
				{"variable": "wield_category", "type": "string"}
			]
		}
	}
}));

// Inappropriately sized
Rules.addRule(new GameObject({
	"body": "<p id=\"inappropriately-sized-weapons\">A creature can't make optimum use of a weapon that isn't properly sized for it. A cumulative &ndash;2 penalty applies on attack rolls for each size category of difference between the size of its intended wielder and the size of its actual wielder. If the creature isn't proficient with the weapon, a &ndash;4 nonproficiency penalty also applies.</p><p>The measure of how much effort it takes to use a weapon (whether the weapon is designated as a light, one-handed, or two-handed weapon for a particular wielder) is altered by one step for each size category of difference between the wielder's size and the size of the creature for which the weapon was designed. For example, a Small creature would wield a Medium one-handed weapon as a two-handed weapon. If a weapon's designation would be changed to something other than light, one-handed, or two-handed by this alteration, the creature can't wield the weapon at all.</p>", 
	"url": "pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Size/Inappropriately Sized Weapons", 
	"type": "section", 
	"name": "Inappropriately Sized Weapons", 
	"source": "Core Rulebook",
	"apply": {
		"weapon": {
			"modifiers": [
				{"variable": "to_hit_modifier", "formula": "$.Weapon.wielderSizePenalty($.getVariable(renderable, this, '$.wielder.size'), $.getVariable(renderable, this, '$.item.size'))"},
			]
		}
	}
}));

