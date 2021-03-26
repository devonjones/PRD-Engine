var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

weapon_hp = {
	"Weapon.Light": {"Weapon.Blade": 2, "Weapon.Hafted": {"Material.Haft.Metal": 10, "*": 2}},
	"Weapon.OneHanded": {"Weapon.Blade": 5, "Weapon.Hafted": {"Material.Haft.Metal": 20, "*": 5}},
	"Weapon.TwoHanded": {"Weapon.Blade": 10, "Weapon.Hafted": 10},
	"Weapon.Ranged": 5
}

weapon_hardness = {
	"Weapon.Light": {"Weapon.Blade": 10, "Weapon.MetalHafted": 10, "Weapon.Hafted": 5},
	"Weapon.OneHanded": {"Weapon.Blade": 10, "Weapon.MetalHafted": 10, "Weapon.Hafted": 5},
	"Weapon.TwoHanded": {"Weapon.Blade": 10, "Weapon.Hafted": 5},
	"Weapon.Ranged": 5
}

sizes = [
	"fine",
	"diminutive",
	"tiny",
	"small",
	"medium",
	"large",
	"huge",
	"gargantuan",
	"colossal"
]

wield_categories = [
	"Light",
	"OneHanded",
	"TwoHanded"
]

weapon_to_hit_adjust = {
	"fine": 8,
	"diminutive": 4,
	"tiny": 2,
	"small": 1,
	"medium": 0,
	"large": -1,
	"huge": -2,
	"gargantuan": -4,
	"colossal": -8
}

weapon_cost_adjust = {
	"fine": 0.125,
	"diminutive": 0.25,
	"tiny": 0.5,
	"small": 1,
	"medium": 1,
	"large": 2,
	"huge": 4,
	"gargantuan": 8,
	"colossal": 16
}

weapon_adjust = {
	"fine": -4,
	"diminutive": -3,
	"tiny": -2,
	"small": -1,
	"medium": 0,
	"large": 1,
	"huge": 2,
	"gargantuan": 3,
	"colossal": 4
}

weapon_2x_adjust = {
	"fine": 0.0625,
	"diminutive": 0.125,
	"tiny": 0.25,
	"small": 0.5,
	"medium": 1,
	"large": 2,
	"huge": 4,
	"gargantuan": 8,
	"colossal": 16
}

weapon_magic_costs = {
	1: 2000,
	2: 8000,
	3: 18000,
	4: 32000,
	5: 50000,
	6: 72000,
	7: 98000,
	8: 128000,
	9: 162000,
	10: 200000
}

module.exports.sizeCost = function(cost, size) {
	var newCost = weapon_cost_adjust[size] * cost;
	return newCost - cost;
}

module.exports.sizeWeight = function(weight, size) {
	var newWeight = weapon_cost_adjust[size] * weight;
	return newWeight - weight;
}

module.exports.sizeDamage = function(damage, size) {
	var steps = weapon_adjust[size];
	return transitionDie(damage, steps);
}

module.exports.sizeToHit = function(size) {
	return weapon_adjust[size];
}

module.exports.hitPoints = function(renderable, size) {
	var tags = renderable.section.tags.get('value')
	var medium = tagTreeResolve(tags.get(), weapon_hp, "Weapon Hit Points");
	return Math.ceil(weapon_2x_adjust[size] * medium);
}

module.exports.hardness = function(renderable, size) {
	var tags = renderable.section.tags.get('value')
	var medium = tagTreeResolve(tags.get(), weapon_hardness, "Weapon Hardness");
	return Math.ceil(weapon_2x_adjust[size] * medium);
}

module.exports.magicCostPlus = function(plus) {
	return weapon_magic_costs[plus];
}

function tagTreeResolve(tags, tree, name) {
	var tmpTags = tags.slice(0);
	tmpTags.push("*");
	for (var i = 0; i < tags.length; i++) {
		if(tags[i] in tree) {
			var item = tree[tags[i]];
			if (typeof item === 'object') {
				return tagTreeResolve(tags, item);
			} else {
				return item;
			}
		}
	}
	throw new Error(name + "tree does not contain a value for tags");
}

module.exports.wielderSizePenalty = function(wielder_size, size) {
	var sizeDiff = sizeCategoryDiff(wielder_size, size);
	return Math.abs(sizeDiff) * -2;
}

module.exports.wielderWieldCategory = function(wieldCategory, wielder_size, size) {
	var sizeDiff = sizeCategoryDiff(wielder_size, size);
	var categoryIndex = wield_categories.indexOf(wieldCategory);
	var newIndex = categoryIndex - sizeDiff;
	if (wieldCategory == "Ranged") {
		if (sizeDiff != 0) {
			throw new Error("Ranged weapons cannot be used by creatures of a different size")
		} else {
			return "Ranged"
		}
	} else if (newIndex < 0) {
		throw new Error(
			"Weapon of size "
			+ size
			+ " is too small to be wielded by a creature of size "
			+ wielder_size)
	} else if (newIndex >= wield_categories.length) {
		throw new Error(
			"Weapon of size "
			+ size
			+ " is too large to be wielded by a creature of size "
			+ wielder_size)
	} else {
		return wield_categories[newIndex];
	}
}

function sizeCategoryDiff(size1, size2) {
	var size1val = sizes.indexOf(size1);
	if(size1val == -1) {
		throw new Error("Unrecognized size: " + size1);
	}
	var size2val = sizes.indexOf(size2);
	if(size2val == -1) {
		throw new Error("Unrecognized size: " + size2);
	}
	return size1val - size2val;
}

/*
- 1 1d2 1d3 1d4 1d6 1d8 2d6 3d6 4d6 6d6 8d6 12d6 ...
... 1d8 1d10 2d8 ...
... 2d6 2d8 3d8 4d8 6d8 8d8 12d8 ...
... 1d10 1d12 3d6 ...
... 1d6 2d4 2d6 ...
... 2d8 2d10 4d8 ...
... 2d10 2d12 6d6 ...

  T    S    M   L   H    G    C
  -    1   1d2 1d3 1d4  1d6  1d8
  1   1d2  1d3 1d4 1d6  1d8  2d6
 1d2  1d3  1d4 1d6 1d8  2d6  3d6
 1d3  1d4  1d6 1d8 2d6  3d6  4d6
 1d4  1d6  1d8 2d6 3d6  4d6  6d6
 1d6  1d8 1d10 2d8 3d8  4d8  6d8
 1d8 1d10 1d12 3d6 4d6  6d6  8d6
 1d4  1d6  2d4 2d6 3d6  4d6  6d6
 1d8 1d10  2d6 3d6 4d6  6d6  8d6
1d10  2d6  2d8 3d8 4d8  6d8  8d8
 2d6  2d8 2d10 4d8 6d8  8d8 12d8
 2d8 2d10 2d12 6d6 8d6 12d6 16d6
*/

die_transitions = {
	"-": ["-", "1"],
	"1": ["-", "1d2"],
	"1d2": ["1", "1d3"],
	"1d3": ["1d2", "1d4"],
	"1d4": ["1d3", "1d6"],
	"1d6": ["1d4", "1d8"],
	"1d8": ["1d6", "2d6"],
	"1d10": ["1d8", "2d8"],
	"1d12": ["1d10", "3d6"],

	"2d4": ["1d6", "2d6"],
	"2d6": ["1d8", "3d6"],
	"2d8": ["2d6", "3d8"],
	"2d10": ["2d8", "4d8"],
	"2d12": ["2d10", "6d6"],

	"3d6": ["2d6", "4d6"],
	"3d8": ["2d8", "4d8"],

	"4d6": ["3d6", "6d6"],
	"4d8": ["3d8", "6d8"],

	"6d6": ["4d6", "8d6"],
	"6d8": ["4d8", "8d8"],

	"8d6": ["6d6", "12d6"],
	"8d8": ["6d8", "12d8"],
}

function transitionDie(die, transition) {
	var new_die = die;
	if(transition >= 0) {
		for(i = 0; i < transition; i++) {
			new_die = die_transitions[new_die][1];
		}
	} else {
		for(i = 0; i > transition; i--) {
			new_die = die_transitions[new_die][0];
		}
	}
	return new_die;
}

module.exports.createFullAttack = function(bab) {
	var attacks = [];
	var negative = 0;
	while(negative < bab) {
		attacks.push({"penalty": -1 * negative, "gen_damage_times": 1});
		negative += 5;
	}
	return attacks;
}

module.exports.createStandardAttack = function(gen_damage_times) {
	gen_damage_times = gen_damage_times || 1
	var attacks = [];
	attacks.push({"penalty": 0, "gen_damage_times": gen_damage_times});
	return attacks;
}
