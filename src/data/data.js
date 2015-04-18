var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var GameObject = require('../models/game_object.js');
var Spell = require('../models/spell.js');
var Rules = require('../models/rules.js');

// "pfsrd://Core Rulebook/Rules/Equipment/Weapons?children=false",
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
		"pfsrd://Core Rulebook/Rules/Additional Rules/Exploration/Breaking and Entering/Smashing an Object"
	],
	"apply": {
		"section": {
			"variables": [
				{"variable": "tags", "default": []},
				{"variable": "name", "default": []}
			]
		},
		"weapon": {
			"variables": [
				{"variable": "size", "default": "medium"},
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
				{"variable": "cost", "default": 0}
			],
			"modifiers": [
				{"variable": "cost", "formula": "$.getVariable(renderable, this, '$.weapon.cost')"}
			]
		},
		"weapon": {
			"variables": [
				{"variable": "cost", "default": 0}
			],
			"modifiers": [
				{"variable": "cost", "formula": "$.Weapon.sizeCost($.getVariable(renderable, this, '$.weapon.cost'), $.getVariable(renderable, this, '$.weapon.size'))"}
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
				{"variable": "medium_damage", "default": "-"},
				{"variable": "damage", "default": "-"}
			],
			"modifiers": [
				{"variable": "damage", "formula": "$.Weapon.sizeDamage($.getVariable(renderable, this, '$.weapon.medium_damage'), $.getVariable(renderable, this, '$.weapon.size'))"}
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
				{"variable": "crit_range", "default": 1},
				{"variable": "crit_mult", "default": 1}
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
				{"variable": "range", "default": 0}
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
				{"variable": "weight", "default": 0}
			]
		},
		"weapon": {
			"modifiers": [
				{"variable": "$.item.weight", "formula": "$.Weapon.sizeWeight($.getVariable(renderable, this, '$.item.weight'), $.getVariable(renderable, this, '$.weapon.size'))"}
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
				{"variable": "type", "default": ""},
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
			"variable": [
				{"variable": "special", "default": []}
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
		"weapon": {
			"modifiers": [
				{"variable": "armor_class", "formula": "-5", "type": "dex_mod"},
				{"variable": "armor_class", "formula": "-2"},
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
		"weapon": {
			"variables": [
				{"variable": "hit_points", "default": 0},
				{"variable": "hardness", "default": 0},
			],
			"modifiers": [
				{"variable": "hit_points", "formula": "$.Weapon.hitPoints(renderable, $.getVariable(renderable, this, '$.weapon.size'))"},
				{"variable": "hardness", "formula": "$.Weapon.hardness(renderable, $.getVariable(renderable, this, '$.weapon.size'))"},
			]
		}
	}
}));

// Weapon AC Size
Rules.addRule(new GameObject({
	"body": "<table id=\"table-7-11-size-and-armor-class-of-objects\"><caption>Table: Size and Armor Class of Objects</caption><thead><tr><th>Size</th><th>AC Modifier</th></tr></thead><tbody><tr class=\"odd\"><td>Colossal</td><td>&ndash;8</td></tr><tr class=\"even\"><td>Gargantuan</td><td>&ndash;4</td></tr><tr class=\"odd\"><td>Huge</td><td>&ndash;2</td></tr><tr class=\"even\"><td>Large</td><td>&ndash;1</td></tr><tr class=\"odd\"><td>Medium</td><td>+0</td></tr><tr class=\"even\"><td>Small</td><td>+1</td></tr><tr class=\"odd\"><td>Tiny</td><td>+2</td></tr><tr class=\"even\"><td>Diminutive</td><td>+4</td></tr><tr class=\"odd\"><td>Fine</td><td>+8</td></tr></tbody></table>",
	"name": "Table: Size and Armor Class of Objects",
	"url": "pfsrd://Core Rulebook/Rules/Additional Rules/Exploration/Breaking and Entering/Table Size and Armor Class of Objects",
	"source": "Core Rulebook",
	"type": "table",
	"apply": {
		"weapon": {
			"variables": [
				{"variable": "armor_class", "default": 10}
			],
			"modifiers": [
				{"variable": "armor_class", "formula": "$.Item.acSize($.getVariable(renderable, this, '$.weapon.size'))", "type": "size"},
			]
		}
	}
}));





// Longsword
Rules.addRule(new GameObject({
	"text": "<p class=\"stat-block\">This sword is about 3-1/2 feet in length.</p>",
	"name": "Longsword",
	"weight": "4 lbs.",
	"url": "pfsrd://Ultimate Equipment/Rules/Arms And Armor/Weapons/Weapon Descriptions/Longsword",
	"price": "15 gp",
	"misc": {
		"Weapon": {
			"Weapon Class": null,
			"Price": "15 gp",
			"Dmg (S)": "1d6",
			"Proficiency": "One-Handed Melee Weapons",
			"Critical": "19&ndash;20/&times;2",
			"Dmg (M)": "1d8",
			"Dmg (L)": "2d6",
			"Type": "S",
			"Dmg (T)": "1d4"
		}
	},
	"source": "Ultimate Equipment",
	"type": "item",
	"subtype": "weapon",
	"dependencies": [
		"pfsrd://Core Rulebook/Rules/Equipment/Weapons"
	],
	"apply": {
		"section": {
			"lists": [
				{"variable": "name", "operation": "push", "value": "Longsword"},
				{"variable": "tags", "operation": "push", "value": [
						"Weapon",
						"Weapon.Melee",
						"Weapon.OneHanded",
						"Weapon.Martial",
						"Weapon.Slashing",
						"Weapon.Blade",
						"Material.Steel",
						"Material.Metal"
				]}
			]
		},
		"item": {
			"modifiers": [
				{"variable": "weight", "formula": "4"}
			],
		},
		"weapon": {
			"modifiers": [
				{"variable": "cost", "formula": "15"},
				{"variable": "medium_damage", "formula": "'1d8'"},
				{"variable": "crit_range", "formula": "1"},
				{"variable": "crit_mult", "formula": "1"},
				{"variable": "type", "formula": "'S'"},
				{"variable": "to_hit_modifier", "formula": "0"},
				{"variable": "damage_modifier", "formula": "0"}
			],
		}
	}
}));



// Masterwork Weapons
Rules.addRule(new GameObject({
	"body": "<p>A masterwork weapon is a finely crafted version of a normal weapon. Wielding it provides a +1 enhancement bonus on attack rolls.</p><p>You can't add the masterwork quality to a weapon after it is created; it must be crafted as a masterwork weapon (see the Craft skill). The masterwork quality adds 300 gp to the cost of a normal weapon (or 6 gp to the cost of a single unit of ammunition). Adding the masterwork quality to a double weapon costs twice the normal increase (+600 gp).</p><p>Masterwork ammunition is damaged (effectively destroyed) when used. The enhancement bonus of masterwork ammunition does not stack with any enhancement bonus of the projectile weapon firing it.</p><p>All magic weapons are automatically considered to be of masterwork quality. The enhancement bonus granted by the masterwork quality doesn't stack with the enhancement bonus provided by the weapon's magic.</p><p>Even though some types of armor and shields can be used as weapons, you can't create a masterwork version of such an item that confers an enhancement bonus on attack rolls. Instead, masterwork armor and shields have lessened armor check penalties.</p>",
	"name": "Masterwork Weapons",
	"url": "pfsrd://Core Rulebook/Rules/Equipment/Weapons/Masterwork Weapons",
	"source": "Core Rulebook",
	"type": "section",
	"apply": {
		"section": {
			"lists": [
				{"variable": "tags", "operation": "push", "value": "Masterwork"},
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

//Magic Plus
Rules.addRule(new GameObject({
	"body": "<p>A magic weapon is enhanced to strike more truly and deliver more damage. Magic weapons have enhancement bonuses ranging from +1 to +5. They apply these bonuses to both attack and damage rolls when used in combat. All magic weapons are also masterwork weapons, but their masterwork bonuses on attack rolls do not stack with their enhancement bonuses on attack rolls.</p><p>Weapons come in two basic categories: melee and ranged. Some of the weapons listed as melee weapons can also be used as ranged weapons. In this case, their enhancement bonuses apply to both melee and ranged attacks.</p><p>Some magic weapons have special abilities. Special abilities count as additional bonuses for determining the market value of the item, but do not modify attack or damage bonuses (except where specifically noted). A single weapon cannot have a modified bonus (enhancement bonus plus special ability bonus equivalents, including those from character abilities and spells) higher than +10. A weapon with a special ability must also have at least a +1 enhancement bonus. Weapons cannot possess the same special ability more than once.</p><p>Weapons or ammunition can be made of an unusual material. Roll d%: 01&ndash;95 indicates that the item is of a standard sort, and 96&ndash;100 indicates that it is made of a special material (see Equipment).</p>",
	"name": "Weapons", 
	"url": "pfsrd://Core Rulebook/Rules/Magic Items/Weapons", 
	"source": "Core Rulebook", 
	"type": "section",
	"dependencies": [
		"pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Table Weapons", 
		"pfsrd://Core Rulebook/Rules/Magic Items/Magic Items/Magic Items and Detect Magic/Item Nature",
		"pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Hardness and Hit Points"
	],
	"apply": {
		"enchantment": {
			"context": true,
			"variables": [
				{"variable": "plus", "default": 0},
				{"variable": "effective_plus", "default": 0}
			],
		},
		"section": {
			"lists": [
				{"variable": "tags", "operation": "push", "value": [
						"Magic",
						"Magic.Plus"
				]},
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
			"modifiers": [
				{"variable": "$.enchantment.plus", "formula": "$.getUrlArg(this, 'plus')"},
				{"variable": "$.enchantment.effective_plus", "formula": "$.getUrlArg(this, 'plus')"},
				{"variable": "to_hit_modifier", "formula": "$.getVariable(renderable, this, '$.enchantment.plus')", "type": "enhancement"},
				{"variable": "damage_modifier", "formula": "$.getVariable(renderable, this, '$.enchantment.plus')", "type": "enhancement"}
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
				{"variable": "hardness", "formula": "$.getVariable(renderable, this, '$.enchantment.plus') * 2"},
				{"variable": "hit_points", "formula": "$.getVariable(renderable, this, '$.enchantment.plus') * 10"}
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
				{"variable": "aura", "default": []},
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
				{"variable": "cost", "default": 0}
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
				{"variable": "effective_plus", "formula": "1"}
			],
			"lists": [
				{"variable": "aura", "operation": "push",
					"value": {"strength": "Moderate", "aura": "Transmutation"}}
			]
		},
		"section": {
			"lists": [
				{"variable": "tags", "operation": "push", "value": "Keen"},
				{"variable": "name", "operation": "insert", "value": "Keen"}
			],
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
				{"variable": "effective_plus", "formula": "1"}
			],
			"lists": [
				{"variable": "aura", "operation": "push",
					"value": {"strength": "Moderate", "aura": "Evocation"}}
			]
		},
		"section": {
			"lists": [
				{"variable": "tags", "operation": "push", "value": "Flaming"},
				{"variable": "name", "operation": "insert", "value": "Flaming"}
			],
		},
		"weapon": {
			"conditions": [
				{
					"text": "Can only be added to weapons with a +1 enchantment",
					"formula": "$.hasTag(renderable, 'Magic.Plus')"
				}
			],
			"variables": [
				{"variable": "bonus_damage", "default": []},
			],
			"lists": [
				{"variable": "bonus_damage", "operation": "push", "value": [
					{"damage": "1d6", "type": "flaming"}
				]}
			]
		}
	}
}));

/*
Rules.addRule(new Spell({
	"school": "evocation", 
	"saving_throw": "Reflex half", 
	"name": "Fireball", 
	"descriptor": [
		"fire"
	], 
	"text": "<p>A <i>fireball</i> spell generates a searing explosion of flame that detonates with a low roar and deals 1d6 points of fire damage per caster level (maximum 10d6) to every creature within the area. Unattended objects also take this damage. The explosion creates almost no pressure.</p><p>You point your finger and determine the range (distance and height) at which the <i>fireball</i> is to burst. A glowing, pea-sized bead streaks from the pointing digit and, unless it impacts upon a material body or solid barrier prior to attaining the prescribed range, blossoms into the <i>fireball</i> at that point. An early impact results in an early detonation. If you attempt to send the bead through a narrow passage, such as through an arrow slit, you must &ldquo;hit&rdquo; the opening with a ranged touch attack, or else the bead strikes the barrier and detonates prematurely.</p><p>The <i>fireball</i> sets fire to combustibles and damages objects in the area. It can melt metals with low melting points, such as lead, gold, copper, silver, and bronze. If the damage caused to an interposing barrier shatters or breaks through it, the <i>fireball</i> may continue beyond the barrier if the area permits; otherwise it stops at the barrier just as any other spell effect does.</p>", 
	"spell_resistance": "yes", 
	"description": "1d6 damage per level, 20-ft. radius.",
	"level": [
		{
			"class": "Sorcerer", 
			"level": 3
		}, 
		{
			"class": "Wizard", 
			"level": 3
		}
	], 
	"casting_time": "1 standard action", 
	"source": "Core Rulebook", 
	"range": "long (400 ft. + 40 ft./level)", 
	"component_text": "V, S, M (a ball of bat guano and sulfur)", 
	"descriptor_text": "fire", 
	"effects": [
		{
			"text": "20-ft.-radius spread", 
			"name": "Area"
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
			"text": "a ball of bat guano and sulfur", 
			"type": "M"
		}
	], 
	"duration": "instantaneous", 
	"type": "spell",
	"url": "pfsrd://Core Rulebook/Spells/Fireball",
	"variables": [
		{"variable": "range", "default": 400, "formula": "40 * $.getVariable(renderable, '$.character.variables.' + $.getVariable(renderable, variable, '$.casting_class') + '.ECL.value');", "name": "Range", "format": {"post": " ft."}},
		{"variable": "area", "default": 20, "name": "Area"}},
		{"variable": "level", "default": 3, "name": "Effective Spell Level"},
		{"variable": "damage_die_sides", "default": 6, "name": "Damage Die Sides"},
		{"variable": "damage_die_max", "default": 10, "name": "Max Damage Dice"},
		{"variable": "damage_die_number", "default": 0, "formula": "$.min([$.getVariable(renderable, '$.character.variables.' + $.getVariable(renderable, '$.casting_class') + '.ECL.value'), $.getVariable(renderable, '$.variables.damage_die_max')]);", "name": "Damage Dice Number"},
		{"variable": "damage_die_bonus", "default": 0, "name": "Damage Dice Bonus"},
		{"variable": "damage_dice", "formula": "$.getVariable(renderable, '$.variables.damage_die_number') + 'd' + $.getVariable(renderable, '$.variables.damage_die_sides') + getSpellValueConditional(renderable, variable, '$.variables.damage_die_bonus.value', '+', null)", "name": "Damage Dice"}
	]
}));
*/

/*
Rules.addRule(new GameObject({
	"name": "", 
	"sections": [
		{
			"source": "Core Rulebook", 
			"text": "<p class=\"stat-block-1\"> You can alter a burst, emanation, or spread-shaped spell to increase its area. Any numeric measurements of the spell's area increase by 100%. A widened spell uses up a spell slot three levels higher than the spell's actual level.</p><p class=\"stat-block-2\">Spells that do not have an area of one of these four sorts are not affected by this feat.</p>", 
			"type": "section", 
			"name": "Benefits"
		}
	], 
	"source": "Core Rulebook", 
	"feat_types": [
		"Metamagic"
	], 
	"type": "condition", 
	"url": "pfsrd://Core Rulebook/Feats/Widen Spell",
	"description": "You can cast your spells so that they occupy a larger space.",
	"apply": {
		"spell": [
			"modifiers": [
				{"variable": "level", "formula": "3"},
				{"variable": "area",  "formula": "$.getVariable(renderable, '$.variables.area')"}
			],
			"name": [
				{"operation": "unshift", "name": "Widened"}
			]
		]
	}
}));
*/

/*
Rules.addRule({
	"name": "Enlarge Spell", 
	"sections": [
		{
			"source": "Core Rulebook", 
			"text": "<p class=\"stat-block-1\"> You can alter a spell with a range of close, medium, or long to increase its range by 100%. An enlarged spell with a range of close now has a range of 50 ft. + 5 ft./level, while medium-range spells have a range of 200 ft. + 20 ft./level and long-range spells have a range of 800 ft. + 80 ft./level. An enlarged spell uses up a spell slot one level higher than the spell's actual level.</p><p class=\"stat-block-2\">Spells whose ranges are not defined by distance, as well as spells whose ranges are not close, medium, or long, do not benefit from this feat.</p>", 
			"type": "section", 
			"name": "Benefits"
		}
	], 
	"source": "Core Rulebook", 
	"feat_types": [
		"Metamagic"
	], 
	"type": "feat", 
	"url": "pfsrd://Core Rulebook/Feats/Enlarge Spell",
	"description": "You can increase the range of your spells.",
	"apply": {
		"spell": [
			"modifiers": [
				{"variable": "level", "formula": "1"},
				{"variable": "range", "formula": "$.getVariable(renderable, '$.variables.range')"}
			],
			"name": [
				{"operation": "unshift", "name": "Enlarged"}
			]
		]
	}
});
*/

/*
Rules.addRule(new GameObject({
	"text": "<p id=\"fatigued\">A fatigued character can neither run nor charge and takes a &ndash;2 penalty to Strength and Dexterity. Doing anything that would normally cause fatigue causes the fatigued character to become exhausted. After 8 hours of complete rest, fatigued characters are no longer fatigued. </p>", 
	"name": "Fatigued", 
	"source": "Core Rulebook", 
	"url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Fatigued", 
	"subtype": "condition", 
	"type": "section"
}));
*/

/*
Rules.addRule({
	"text": "<p id=\"bleed\">A creature that is taking bleed damage takes the listed amount of damage at the beginning of its turn. Bleeding can be stopped by a DC 15 Heal check or through the application of any spell that cures hit point damage (even if the bleed is ability damage). Some bleed effects cause ability damage or even ability drain. Bleed effects do not stack with each other unless they deal different kinds of damage. When two or more bleed effects deal the same kind of damage, take the worse effect. In this case, ability drain is worse than ability damage.</p>", 
	"name": "Bleed", 
	"source": "Core Rulebook", 
	"url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Bleed", 
	"subtype": "condition", 
	"type": "section"
});
*/

/*
Rules.addRule({
	"text": "<p id=\"blinded\">The creature cannot see. It takes a &ndash;2 penalty to Armor Class, loses its Dexterity bonus to AC (if any), and takes a &ndash;4 penalty on most Strength- and Dexterity-based skill checks and on opposed Perception skill checks. All checks and activities that rely on vision (such as reading and Perception checks based on sight) automatically fail. All opponents are considered to have total concealment (50% miss chance) against the blinded character. Blind creatures must make a DC 10 Acrobatics skill check to move faster than half speed. Creatures that fail this check fall prone. Characters who remain blinded for a long time grow accustomed to these drawbacks and can overcome some of them.</p>", 
	"name": "Blinded", 
	"source": "Core Rulebook", 
	"url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Blinded", 
	"subtype": "condition", 
	"type": "section",
	"apply": {
		"ac": [
			{"variable": "misc", "formula": "-2"},
			{"variable": "dex_mod", "formula": "-1 * max([getACValue(renderable, variable, '$.variables.ac.dex_mod'), 0]"}
		]
	}
});
*/

/*
Rules.addRule({
	"text": "<p id=\"broken\">Items that have taken damage in excess of half their total hit points gain the broken condition, meaning they are less effective at their designated task. The broken condition has the following effects, depending upon the item.</p><ul><li> If the item is a weapon, any attacks made with the item suffer a &ndash;2 penalty on attack and damage rolls. Such weapons only score a critical hit on a natural 20 and only deal &times;2 damage on a confirmed critical hit.</li><li> If the item is a suit of armor or a shield, the bonus it grants to AC is halved, rounding down. Broken armor doubles its armor check penalty on skills.</li><li> If the item is a tool needed for a skill, any skill check made with the item takes a &ndash;2 penalty.</li><li> If the item is a wand or staff, it uses up twice as many charges when used.</li><li> If the item does not fit into any of these categories, the broken condition has no effect on its use. Items with the broken condition, regardless of type, are worth 75% of their normal value. If the item is magical, it can only be repaired with a <i>mending</i> or <i>make whole</i> spell cast by a character with a caster level equal to or higher than the item's. Items lose the broken condition if the spell restores the object to half its original hit points or higher. Non-magical items can be repaired in a similar fashion, or through the Craft skill used to create it. Generally speaking, this requires a DC 20 Craft check and 1 hour of work per point of damage to be repaired. Most craftsmen charge one-tenth the item's total cost to repair such damage (more if the item is badly damaged or ruined).</li></ul>", 
	"name": "Broken", 
	"source": "Core Rulebook", 
	"url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Broken", 
	"subtype": "condition", 
	"type": "section"
	"apply": {
		"weapon": [
			{"variable": "to_hit", "formula": "-2"},
			{"variable": "damage", "formula": "-2"},
			{"variable": "critical", "formula": "20"}
		],
		"armor": [
			{"variable": "ac", "formula": "-2"}
		],
		"item": [
			{"variable": "cost", "formula": "getItemValue(renderable, variable, '$.variables.item.cost') * 0.75"}
		],
	}
});
*/

/*
Rules.addRule({
    "text": "<p id=\"confused\">A confused creature is mentally befuddled and cannot act normally. A confused creature cannot tell the difference between ally and foe, treating all creatures as enemies. Allies wishing to cast a beneficial spell that requires a touch on a confused creature must succeed on a melee touch attack. If a confused creature is attacked, it attacks the creature that last attacked it until that creature is dead or out of sight.</p><p>Roll on the following table at the beginning of each confused subject's turn each round to see what the subject does in that round. </p><table><thead><tr><th>d%</th><th>Behavior</th></tr></thead><tr class=\"odd\"><td>01&ndash;25</td><td>Act normally.</td></tr><tr class=\"even\"><td>26&ndash;50</td><td>Do nothing but babble incoherently.</td></tr><tr class=\"odd\"><td>51&ndash;75</td><td>Deal 1d8 points of damage + Str modifier to self with item in hand.</td></tr><tr class=\"even\"><td>76&ndash;100</td><td>Attack nearest creature (for this purpose, a familiar counts as part of the subject's self).</td></tr></table><p>A confused creature who can't carry out the indicated action does nothing but babble incoherently. Attackers are not at any special advantage when attacking a confused creature. Any confused creature who is attacked automatically attacks its attackers on its next turn, as long as it is still confused when its turn comes. Note that a confused creature will not make attacks of opportunity against anything that it is not already devoted to attacking (either because of its most recent action or because it has just been attacked).</p>", 
    "name": "Confused", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Confused", 
    "type": "section", 
    "subtype": "condition", 
    ]
});
*/

/*
Rules.addRule({
    "text": "<p id=\"cowering\">The character is frozen in fear and can take no actions. A cowering character takes a &ndash;2 penalty to Armor Class and loses his Dexterity bonus (if any).</p>", 
    "name": "Cowering", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Cowering", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"dazed\">The creature is unable to act normally. A dazed creature can take no actions, but has no penalty to AC.</p><p>A dazed condition typically lasts 1 round.</p>", 
    "name": "Dazed", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Dazed", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"dazzled\">The creature is unable to see well because of overstimulation of the eyes. A dazzled creature takes a &ndash;1 penalty on attack rolls and sight-based Perception checks.</p>", 
    "name": "Dazzled", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Dazzled", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"dead\">The character's hit points are reduced to a negative amount equal to his Constitution score, his Constitution drops to 0, or he is killed outright by a spell or effect. The character's soul leaves his body. Dead characters cannot benefit from normal or magical healing, but they can be restored to life via magic. A dead body decays normally unless magically preserved, but magic that restores a dead character to life also restores the body either to full health or to its condition at the time of death (depending on the spell or device). Either way, resurrected characters need not worry about rigor mortis, decomposition, and other conditions that affect dead bodies.</p>", 
    "name": "Dead", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Dead", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"deafened\">A deafened character cannot hear. He takes a &ndash;4 penalty on initiative checks, automatically fails Perception checks based on sound, takes a &ndash;4 penalty on opposed Perception checks, and has a 20% chance of spell failure when casting spells with verbal components. Characters who remain deafened for a long time grow accustomed to these drawbacks and can overcome some of them.</p>", 
    "name": "Deafened", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Deafened", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"disabled\">A character with 0 hit points, or one who has negative hit points but has become stable and conscious, is disabled. A disabled character may take a single move action or standard action each round (but not both, nor can he take full-round actions, but he can still take swift, immediate, and free actions). He moves at half speed. Taking move actions doesn't risk further injury, but performing any standard action (or any other action the GM deems strenuous, including some free actions such as casting a quickened spell) deals 1 point of damage after the completion of the act. Unless the action increased the disabled character's hit points, he is now in negative hit points and dying.</p><p>A disabled character with negative hit points recovers hit points naturally if he is being helped. Otherwise, each day he can attempt a DC 10 Constitution check after resting for 8 hours, to begin recovering hit points naturally. The character takes a penalty on this roll equal to his negative hit point total. Failing this check causes the character to lose 1 hit point, but this does not cause the character to become unconscious. Once a character makes this check, he continues to heal naturally and is no longer in danger of losing hit points naturally.</p>", 
    "name": "Disabled", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Disabled", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"dying\">A dying creature is unconscious and near death. Creatures that have negative hit points and have not stabilized are dying. A dying creature can take no actions. On the character's next turn, after being reduced to negative hit points (but not dead), and on all subsequent turns, the character must make a DC 10 Constitution check to become stable. The character takes a penalty on this roll equal to his negative hit point total. A character that is stable does not need to make this check. A natural 20 on this check is an automatic success. If the character fails this check, he loses 1 hit point. If a dying creature has an amount of negative hit points equal to its Constitution score, it dies.</p>", 
    "name": "Dying", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Dying", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"energy-drained\">The character gains one or more negative levels, which might become permanent. If the subject has at least as many negative levels as Hit Dice, he dies. See Energy Drain and Negative levels for more information. </p>", 
    "name": "Energy Drained", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Energy Drained", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"entangled\">The character is ensnared. Being entangled impedes movement, but does not entirely prevent it unless the bonds are anchored to an immobile object or tethered by an opposing force. An entangled creature moves at half speed, cannot run or charge, and takes a &ndash;2 penalty on all attack rolls and a &ndash;4 penalty to Dexterity. An entangled character who attempts to cast a spell must make a concentration check (DC 15 + spell level) or lose the spell. </p>", 
    "name": "Entangled", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Entangled", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"exhausted\">An exhausted character moves at half speed, cannot run or charge, and takes a &ndash;6 penalty to Strength and Dexterity. After 1 hour of complete rest, an exhausted character becomes fatigued. A fatigued character becomes exhausted by doing something else that would normally cause fatigue.</p>", 
    "name": "Exhausted", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Exhausted", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"fascinated\">A fascinated creature is entranced by a supernatural or spell effect. The creature stands or sits quietly, taking no actions other than to pay attention to the fascinating effect, for as long as the effect lasts. It takes a &ndash;4 penalty on skill checks made as reactions, such as Perception checks. Any potential threat, such as a hostile creature approaching, allows the fascinated creature a new saving throw against the fascinating effect. Any obvious threat, such as someone drawing a weapon, casting a spell, or aiming a ranged weapon at the fascinated creature, automatically breaks the effect. A fascinated creature's ally may shake it free of the spell as a standard action. </p>", 
    "name": "Fascinated", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Fascinated", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"fatigued\">A fatigued character can neither run nor charge and takes a &ndash;2 penalty to Strength and Dexterity. Doing anything that would normally cause fatigue causes the fatigued character to become exhausted. After 8 hours of complete rest, fatigued characters are no longer fatigued. </p>", 
    "name": "Fatigued", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Fatigued", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"flat-footed\">A character who has not yet acted during a combat is flat-footed, unable to react normally to the situation. A flat-footed character loses his Dexterity bonus to AC (if any) and cannot make attacks of opportunity. </p>", 
    "name": "Flat-Footed", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Flat-Footed", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"frightened\">A frightened creature flees from the source of its fear as best it can. If unable to flee, it may fight. A frightened creature takes a &ndash;2 penalty on all attack rolls, saving throws, skill checks, and ability checks. A frightened creature can use special abilities, including spells, to flee; indeed, the creature must use such means if they are the only way to escape. </p><p>Frightened is like shaken, except that the creature must flee if possible. Panicked is a more extreme state of fear.</p>", 
    "name": "Frightened", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Frightened", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"grappled\">A grappled creature is restrained by a creature, trap, or effect. Grappled creatures cannot move and take a &ndash;4 penalty to Dexterity. A grappled creature takes a &ndash;2 penalty on all attack rolls and combat maneuver checks, except those made to grapple or escape a grapple. In addition, grappled creatures can take no action that requires two hands to perform. A grappled character who attempts to cast a spell or use a spell-like ability must make a concentration check (DC 10 + grappler's CMB + spell level), or lose the spell. Grappled creatures cannot make attacks of opportunity.</p><p>A grappled creature cannot use Stealth to hide from the creature grappling it, even if a special ability, such as hide in plain sight, would normally allow it to do so. If a grappled creature becomes invisible, through a spell or other ability, it gains a +2 circumstance bonus on its CMD to avoid being grappled, but receives no other benefit.</p>", 
    "name": "Grappled", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Grappled", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"helpless\">A helpless character is paralyzed, held, bound, sleeping, unconscious, or otherwise completely at an opponent's mercy. A helpless target is treated as having a Dexterity of 0 (&ndash;5 modifier). Melee attacks against a helpless target get a +4 bonus (equivalent to attacking a prone target). Ranged attacks get no special bonus against helpless targets. Rogues can sneak attack helpless targets. </p><p>As a full-round action, an enemy can use a melee weapon to deliver a coup de grace to a helpless foe. An enemy can also use a bow or crossbow, provided he is adjacent to the target. The attacker automatically hits and scores a critical hit. (A rogue also gets his sneak attack damage bonus against a helpless foe when delivering a coup de grace.) If the defender survives, he must make a Fortitude save (DC 10 + damage dealt) or die. Delivering a coup de grace provokes attacks of opportunity. </p><p>Creatures that are immune to critical hits do not take critical damage, nor do they need to make Fortitude saves to avoid being killed by a coup de grace.</p>", 
    "name": "Helpless", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Helpless", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"incorporeal\">Creatures with the incorporeal condition do not have a physical body. Incorporeal creatures are immune to all nonmagical attack forms. Incorporeal creatures take half damage (50%) from magic weapons, spells, spell-like effects, and supernatural effects. Incorporeal creatures take full damage from other incorporeal creatures and effects, as well as all force effects. </p>", 
    "name": "Incorporeal", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Incorporeal", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"invisible\">Invisible creatures are visually undetectable. An invisible creature gains a +2 bonus on attack rolls against sighted opponents, and ignores its opponents' Dexterity bonuses to AC (if any). See Invisibility, under Special Abilities.</p>", 
    "name": "Invisible", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Invisible", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"nauseated\">Creatures with the nauseated condition experience stomach distress. Nauseated creatures are unable to attack, cast spells, concentrate on spells, or do anything else requiring attention. The only action such a character can take is a single move actions per turn.</p>", 
    "name": "Nauseated", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Nauseated", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"panicked\">A panicked creature must drop anything it holds and flee at top speed from the source of its fear, as well as any other dangers it encounters, along a random path. It can't take any other actions. In addition, the creature takes a &ndash;2 penalty on all saving throws, skill checks, and ability checks. If cornered, a panicked creature cowers and does not attack, typically using the total defense action in combat. A panicked creature can use special abilities, including spells, to flee; indeed, the creature must use such means if they are the only way to escape.</p><p>Panicked is a more extreme state of fear than shaken or frightened.</p>", 
    "name": "Panicked", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Panicked", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"paralyzed\">A paralyzed character is frozen in place and unable to move or act. A paralyzed character has effective Dexterity and Strength scores of 0 and is helpless, but can take purely mental actions. A winged creature flying in the air at the time that it becomes paralyzed cannot flap its wings and falls. A paralyzed swimmer can't swim and may drown. A creature can move through a space occupied by a paralyzed creature&mdash;ally or not. Each square occupied by a paralyzed creature, however, counts as 2 squares to move through.</p>", 
    "name": "Paralyzed", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Paralyzed", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"petrified\">A petrified character has been turned to stone and is considered unconscious. If a petrified character cracks or breaks, but the broken pieces are joined with the body as he returns to flesh, he is unharmed. If the character's petrified body is incomplete when it returns to flesh, the body is likewise incomplete and there is some amount of permanent hit point loss and/or debilitation.</p>", 
    "name": "Petrified", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Petrified", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"pinned\">A pinned creature is tightly bound and can take few actions. A pinned creature cannot move and is denied its Dexterity bonus. A pinned character also takes an additional &ndash;4 penalty to his Armor Class. A pinned creature is limited in the actions that it can take. A pinned creature can always attempt to free itself, usually through a combat maneuver check or Escape Artist check. A pinned creature can take verbal and mental actions, but cannot cast any spells that require a somatic or material component. A pinned character who attempts to cast a spell or use a spell-like ability must make a concentration check (DC 10 + grappler's CMB + spell level) or lose the spell. Pinned is a more severe version of grappled, and their effects do not stack.</p>", 
    "name": "Pinned", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Pinned", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"prone\">The character is lying on the ground. A prone attacker has a &ndash;4 penalty on melee attack rolls and cannot use a ranged weapon (except for a crossbow). A prone defender gains a +4 bonus to Armor Class against ranged attacks, but takes a &ndash;4 penalty to AC against melee attacks.</p><p>Standing up is a move-equivalent action that provokes an attack of opportunity.</p>", 
    "name": "Prone", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Prone", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"shaken\">A shaken character takes a &ndash;2 penalty on attack rolls, saving throws, skill checks, and ability checks. Shaken is a less severe state of fear than frightened or panicked.</p>", 
    "name": "Shaken", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Shaken", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"sickened\">The character takes a &ndash;2 penalty on all attack rolls, weapon damage rolls, saving throws, skill checks, and ability checks.</p>", 
    "name": "Sickened", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Sickened", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"stable\">A character who was dying but who has stopped losing hit points each round and still has negative hit points is stable. The character is no longer dying, but is still unconscious. If the character has become stable because of aid from another character (such as a Heal check or magical healing), then the character no longer loses hit points. The character can make a DC 10 Constitution check each hour to become conscious and disabled (even though his hit points are still negative). The character takes a penalty on this roll equal to his negative hit point total. </p><p>If a character has become stable on his own and hasn't had help, he is still at risk of losing hit points. Each hour he can make a Constitution check to become stable (as a character that has received aid), but each failed check causes him to lose 1 hit point.</p>", 
    "name": "Stable", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Stable", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"staggered\">A staggered creature may take a single move action or standard action each round (but not both, nor can he take full-round actions). A staggered creature can still take free, swift and immediate actions. A creature with nonlethal damage exactly equal to its current hit points gains the staggered condition.</p>", 
    "name": "Staggered", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Staggered", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"stunned\">A stunned creature drops everything held, can't take actions, takes a &ndash;2 penalty to AC, and loses its Dexterity bonus to AC (if any).</p>", 
    "name": "Stunned", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Stunned", 
    "subtype": "condition", 
    "type": "section"
});
*/

/*
Rules.addRule({
    "text": "<p id=\"unconscious\">Unconscious creatures are knocked out and helpless. Unconsciousness can result from having negative hit points (but not more than the creature's Constitution score), or from nonlethal damage in excess of current hit points.</p>", 
    "name": "Unconscious", 
    "source": "Core Rulebook", 
    "url": "pfsrd://Core Rulebook/Rules/Glossary/Conditions/Unconscious", 
    "subtype": "condition", 
    "type": "section"
});
*/
