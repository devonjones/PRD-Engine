var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var GameObject = require('../models/game_object.js');
var Rules = require('../models/rules.js');

Rules.addRule(new GameObject({
	"name": "Clustered Shots", 
	"url": "pfsrd://Ultimate Combat/Feats/Clustered Shots", 
	"sections": [
		{
			"source": "Ultimate Combat", 
			"type": "section", 
			"name": "Prerequisites", 
			"description": "Point-Blank Shot, Precise Shot, base attack bonus +6."
		}, 
		{
			"body": "<p>When you use a full-attack action to make multiple ranged weapon attacks against the same opponent, total the damage from all hits before applying that opponent's damage reduction.</p>", 
			"source": "Ultimate Combat", 
			"type": "section", 
			"name": "Benefits"
		}, 
		{
			"body": "<p>If the massive damage optional rule is being used (<i>Core Rulebook</i> 189), that rule applies if the total damage you deal with this feat is equal to or exceeds half the opponent's full normal hit points (minimum 50 points of damage).</p>", 
			"source": "Ultimate Combat", 
			"type": "section", 
			"name": "Special"
		}
	], 
	"source": "Ultimate Combat", 
	"feat_types": {
		"feat_type": "Combat"
	}, 
	"type": "feat", 
	"description": "You take a moment to carefully aim your shots, causing them all to strike nearly the same spot.",
	"apply": {
		"wielder": {
			"optional": true,
			"lists": [
				{"variable": "special", "operation": "push", "value": "When you use a full-attack action to make multiple ranged weapon attacks against the same opponent, total the damage from all hits before applying that opponent's damage reduction."}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"name": "Enfilading Fire", 
	"url": "pfsrd://Ultimate Combat/Feats/Enfilading Fire", 
	"sections": [
		{
			"source": "Ultimate Combat", 
			"type": "section", 
			"name": "Prerequisites", 
			"description": "Point-Blank Shot, Precise Shot, one other teamwork feat."
		}, 
		{
			"body": "<p>You receive a +2 bonus on ranged attacks made against a foe flanked by 1 or more allies with this feat.</p>", 
			"source": "Ultimate Combat", 
			"type": "section", 
			"name": "Benefits"
		}
	], 
	"source": "Ultimate Combat", 
	"feat_types": {
		"feat_type": "Teamwork"
	}, 
	"type": "feat", 
	"description": "Your ranged attacks take advantage of the flanking maneuvers of allies. ",
	"apply": {
		"weapon": {
			"optional": true,
			"modifiers": [
				{"variable": "to_hit_modifier", "formula": "2", "type": "flanking"},
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"name": "Far Shot", 
	"url": "pfsrd://Core Rulebook/Feats/Far Shot", 
	"sections": [
		{
			"source": "Core Rulebook", 
			"type": "section", 
			"name": "Prerequisites", 
			"description": " Point-Blank Shot."
		}, 
		{
			"body": "<p class=\"stat-block-1\"> You only suffer a &ndash;1 penalty per full range increment between you and your target when using a ranged weapon.</p>", 
			"source": "Core Rulebook", 
			"type": "section", 
			"name": "Benefits"
		}, 
		{
			"body": "<p class=\"stat-block-1\"> You suffer a &ndash;2 penalty per full range increment between you and your target.</p>", 
			"source": "Core Rulebook", 
			"type": "section", 
			"name": "Normal"
		}
	], 
	"source": "Core Rulebook", 
	"feat_types": {
		"feat_type": "Combat"
	}, 
	"type": "feat", 
	"description": "You are more accurate at longer ranges.",
	"apply": {
		"weapon": {
			"modifiers": [
				{"variable": "range_penalty", "formula": "1"}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"name": "Greater Snap Shot", 
	"url": "pfsrd://Ultimate Combat/Feats/Greater Snap Shot", 
	"sections": [
		{
			"source": "Ultimate Combat", 
			"type": "section", 
			"name": "Prerequisites", 
			"description": "Dex 17, Improved Snap Shot, Point-Blank Shot, Rapid Shot, Snap Shot, base attack bonus +12."
		}, 
		{
			"body": "<p>Whenever you make an attack of opportunity using a ranged weapon and hit, you gain a +2 bonus on the damage roll and a +2 bonus on rolls to confirm a critical hit with that attack. These bonuses increase to +4 when you have base attack bonus +16, and to +6 when you have base attack bonus +20. </p>", 
			"source": "Ultimate Combat", 
			"type": "section", 
			"name": "Benefits"
		}
	], 
	"source": "Ultimate Combat", 
	"feat_types": {
		"feat_type": "Combat"
	}, 
	"type": "feat", 
	"description": "You can prey on any gap in your foe's guard with impunity, and with even greater range.",
	"apply": {
		"weapon": {
			"modifiers": [
				{"variable": "crit_confirm_modifier", "formula": "Math.floor(($.getVariable(renderable, this, '$.wielder.bab') - 8) / 4) * 2"},
				{"variable": "crit_damage_modifier", "formula": "Math.floor(($.getVariable(renderable, this, '$.wielder.bab') - 8) / 4) * 2"}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"name": "Impact Critical Shot", 
	"url": "pfsrd://Ultimate Combat/Feats/Impact Critical Shot", 
	"sections": [
		{
			"source": "Ultimate Combat", 
			"type": "section", 
			"name": "Prerequisites", 
			"description": "Dex 13, Point-Blank Shot, base attack bonus +9."
		}, 
		{
			"body": "<p>Whenever you score a critical hit with a ranged attack, in addition to the normal damage your attack deals, if your confirmation roll exceeds your opponent's CMD, you can push your opponent back as if from the bull rush combat maneuver or knock that target prone as if from a trip combat maneuver. If you choose to bull rush, you cannot move with the target. Your maneuver does not provoke an attack of opportunity.</p>", 
			"source": "Ultimate Combat", 
			"type": "section", 
			"name": "Benefits"
		}, 
		{
			"body": "<p>You must perform a bull rush combat maneuver to bull rush an opponent, and you must perform a trip combat maneuver to trip an opponent.</p>", 
			"source": "Ultimate Combat", 
			"type": "section", 
			"name": "Normal"
		}
	], 
	"source": "Ultimate Combat", 
	"feat_types": {
		"feat_type": "Critical"
	}, 
	"type": "feat", 
	"description": "With a series of ranged attacks, you bring your foes to their knees or force them to move.",
	"apply": {
		"wielder": {
			"lists": [
				{"variable": "crit_special", "operation": "push", "value": "Whenever you score a critical hit with a ranged attack, in addition to the normal damage your attack deals, if your confirmation roll exceeds your opponent's CMD, you can push your opponent back as if from the bull rush combat maneuver or knock that target prone as if from a trip combat maneuver. If you choose to bull rush, you cannot move with the target. Your maneuver does not provoke an attack of opportunity."}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"name": "Improved Precise Shot", 
	"url": "pfsrd://Core Rulebook/Feats/Improved Precise Shot", 
	"sections": [
		{
			"source": "Core Rulebook", 
			"type": "section", 
			"name": "Prerequisites", 
			"description": " Dex 19, Point-Blank Shot, Precise Shot, base attack bonus +11."
		}, 
		{
			"body": "<p class=\"stat-block-1\"> Your ranged attacks ignore the AC bonus granted to targets by anything less than total cover, and the miss chance granted to targets by anything less than total concealment. Total cover and total concealment provide their normal benefits against your ranged attacks.</p>", 
			"source": "Core Rulebook", 
			"type": "section", 
			"name": "Benefits"
		}, 
		{
			"body": "<p class=\"stat-block-1\"> See the normal rules on the effects of cover and concealment in Combat. </p>", 
			"source": "Core Rulebook", 
			"type": "section", 
			"name": "Normal"
		}
	], 
	"source": "Core Rulebook", 
	"feat_types": {
		"feat_type": "Combat"
	}, 
	"type": "feat", 
	"description": "Your ranged attacks ignore anything but total concealment and cover.",
	"apply": {
		"wielder": {
			"lists": [
				{"variable": "special", "operation": "push", "value": "Your ranged attacks ignore the AC bonus granted to targets by anything less than total cover, and the miss chance granted to targets by anything less than total concealment. Total cover and total concealment provide their normal benefits against your ranged attacks."}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"name": "Improved Snap Shot", 
	"url": "pfsrd://Ultimate Combat/Feats/Improved Snap Shot", 
	"sections": [
		{
			"source": "Ultimate Combat", 
			"type": "section", 
			"name": "Prerequisites", 
			"description": "Dex 15, Point-Blank Shot, Rapid Shot, Snap Shot, Weapon Focus, base attack bonus +9."
		}, 
		{
			"body": "<p>You threaten an additional 10 feet with Snap Shot. </p>", 
			"source": "Ultimate Combat", 
			"type": "section", 
			"name": "Benefits"
		}, 
		{
			"body": "<p>Making a ranged attack provokes attacks of opportunity.</p>", 
			"source": "Ultimate Combat", 
			"type": "section", 
			"name": "Normal"
		}
	], 
	"source": "Ultimate Combat", 
	"feat_types": {
		"feat_type": "Combat"
	}, 
	"type": "feat", 
	"description": "You can take advantage of your opponent's vulnerabilities from a greater distance, and without exposing yourself.",
	"apply": {
		"weapon": {
			"modifiers": [
				{"variable": "threat_range", "formula": "10"},
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"name": "Manyshot", 
	"url": "pfsrd://Core Rulebook/Feats/Manyshot", 
	"sections": [
		{
			"source": "Core Rulebook", 
			"type": "section", 
			"name": "Prerequisites", 
			"description": " Dex 17, Point-Blank Shot, Rapid Shot, base attack bonus +6."
		}, 
		{
			"body": "<p class=\"stat-block-1\"> When making a full-attack action with a bow, your first attack fires two arrows. If the attack hits, both arrows hit. Apply precision-based damage (such as sneak attack) and critical hit damage only once for this attack. Damage bonuses from using a composite bow with a high Strength bonus apply to each arrow, as do other damage bonuses, such as a ranger's favored enemy bonus. Damage reduction and resistances apply separately to each arrow.</p>", 
			"source": "Core Rulebook", 
			"type": "section", 
			"name": "Benefits"
		}
	], 
	"source": "Core Rulebook", 
	"feat_types": {
		"feat_type": "Combat"
	}, 
	"type": "feat", 
	"description": "You can fire multiple arrows at a single target.",
	"apply": {
		"weapon": {
			"optional": true,
			"lists": [
				{"variable": "$.wielder.full_attack", "operation": "shift"},
				{"variable": "$.wielder.full_attack", "operation": "unshift", "formula": "$.Weapon.createStandardAttack(2)"},
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"name": "Pinpoint Targeting", 
	"url": "pfsrd://Core Rulebook/Feats/Pinpoint Targeting", 
	"sections": [
		{
			"source": "Core Rulebook", 
			"type": "section", 
			"name": "Prerequisites", 
			"description": " Dex 19, Improved Precise Shot, Point-Blank Shot, Precise Shot, base attack bonus +16."
		}, 
		{
			"body": "<p class=\"stat-block-1\"> As a standard action, make a single ranged attack. The target does not gain any armor, natural armor, or shield bonuses to its Armor Class. You do not gain the benefit of this feat if you move this round.</p>", 
			"source": "Core Rulebook", 
			"type": "section", 
			"name": "Benefits"
		}
	], 
	"source": "Core Rulebook", 
	"feat_types": {
		"feat_type": "Combat"
	}, 
	"type": "feat", 
	"description": "You can target the weak points in your opponent's armor.",
	"apply": {
		"wielder": {
			"optional": true,
			"lists": [
				{"variable": "special", "operation": "push", "value": "As a standard action, make a single ranged attack. The target does not gain any armor, natural armor, or shield bonuses to its Armor Class. You do not gain the benefit of this feat if you move this round."}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"name": "Point-Blank Shot", 
	"url": "pfsrd://Core Rulebook/Feats/Point-Blank Shot", 
	"sections": [
		{
			"body": "<p class=\"stat-block-1\"> You get a +1 bonus on attack and damage rolls with ranged weapons at ranges of up to 30 feet.</p>", 
			"source": "Core Rulebook", 
			"type": "section", 
			"name": "Benefits"
		}
	], 
	"source": "Core Rulebook", 
	"feat_types": {
		"feat_type": "Combat"
	}, 
	"type": "feat", 
	"description": "You are especially accurate when making ranged attacks against close targets.",
	"apply": {
		"weapon": {
			"optional": true,
			"modifiers": [
				{"variable": "to_hit_modifier", "formula": "1"}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"name": "Precise Shot", 
	"url": "pfsrd://Core Rulebook/Feats/Precise Shot", 
	"sections": [
		{
			"source": "Core Rulebook", 
			"type": "section", 
			"name": "Prerequisites", 
			"description": " Point-Blank Shot."
		}, 
		{
			"body": "<p class=\"stat-block-1\"> You can shoot or throw ranged weapons at an opponent engaged in melee without taking the standard &ndash;4 penalty on your attack roll.</p>", 
			"source": "Core Rulebook", 
			"type": "section", 
			"name": "Benefits"
		}
	], 
	"source": "Core Rulebook", 
	"feat_types": {
		"feat_type": "Combat"
	}, 
	"type": "feat", 
	"description": "You are adept at firing ranged attacks into melee.",
	"apply": {
		"wielder": {
			"optional": true,
			"lists": [
				{"variable": "special", "operation": "push", "value": "You can shoot or throw ranged weapons at an opponent engaged in melee without taking the standard &ndash;4 penalty on your attack roll."}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"name": "Rapid Shot", 
	"url": "pfsrd://Core Rulebook/Feats/Rapid Shot", 
	"sections": [
		{
			"source": "Core Rulebook", 
			"type": "section", 
			"name": "Prerequisites", 
			"description": " Dex 13, Point-Blank Shot."
		}, 
		{
			"body": "<p class=\"stat-block-1\"> When making a full-attack action with a ranged weapon, you can fire one additional time this round. All of your attack rolls take a &ndash;2 penalty when using Rapid Shot.</p>", 
			"source": "Core Rulebook", 
			"type": "section", 
			"name": "Benefits"
		}
	], 
	"source": "Core Rulebook", 
	"feat_types": {
		"feat_type": "Combat"
	}, 
	"type": "feat", 
	"description": "You can make an additional ranged attack.",
	"apply": {
		"weapon": {
			"optional": true,
			"lists": [
				{"variable": "$.wielder.full_attack", "operation": "insert", "formula": "$.Weapon.createStandardAttack()"}
			],
			"modifiers": [
				{"variable": "to_hit_modifier", "formula": "-2"}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"name": "Shot on the Run", 
	"url": "pfsrd://Core Rulebook/Feats/Shot on the Run", 
	"sections": [
		{
			"source": "Core Rulebook", 
			"type": "section", 
			"name": "Prerequisites", 
			"description": " Dex 13, Dodge, Mobility, Point-Blank Shot, base attack bonus +4."
		}, 
		{
			"body": "<p class=\"stat-block-1\"> As a full-round action, you can move up to your speed and make a single ranged attack at any point during your movement.</p>", 
			"source": "Core Rulebook", 
			"type": "section", 
			"name": "Benefits"
		}, 
		{
			"body": "<p class=\"stat-block-1\"> You cannot move before and after an attack with a ranged weapon.</p>", 
			"source": "Core Rulebook", 
			"type": "section", 
			"name": "Normal"
		}
	], 
	"source": "Core Rulebook", 
	"feat_types": {
		"feat_type": "Combat"
	}, 
	"type": "feat", 
	"description": "You can move, fire a ranged weapon, and move again before your foes can react."
}));

Rules.addRule(new GameObject({
	"name": "Snap Shot", 
	"url": "pfsrd://Ultimate Combat/Feats/Snap Shot", 
	"sections": [
		{
			"source": "Ultimate Combat", 
			"type": "section", 
			"name": "Prerequisites", 
			"description": "Dex 13, Point-Blank Shot, Rapid Shot, Weapon Focus, base attack bonus +6."
		}, 
		{
			"body": "<p>While wielding a ranged weapon with which you have Weapon Focus, you threaten squares within 5 feet of you. You can make attacks of opportunity with that ranged weapon. You do not provoke attacks of opportunity when making a ranged attack as an attack of opportunity.</p>", 
			"source": "Ultimate Combat", 
			"type": "section", 
			"name": "Benefits"
		}, 
		{
			"body": "<p>While wielding a ranged weapon, you threaten no squares and can make no attacks of opportunity with that weapon.</p>", 
			"source": "Ultimate Combat", 
			"type": "section", 
			"name": "Normal"
		}
	], 
	"source": "Ultimate Combat", 
	"feat_types": {
		"feat_type": "Combat"
	}, 
	"type": "feat", 
	"description": "With a ranged weapon, you can take advantage of any opening in your opponent's defenses.",
	"apply": {
		"weapon": {
			"variables": [
				{"variable": "threat_range", "type": "number", "default": 5},
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"name": "Target of Opportunity", 
	"url": "pfsrd://Ultimate Combat/Feats/Target of Opportunity", 
	"sections": [
		{
			"source": "Ultimate Combat", 
			"type": "section", 
			"name": "Prerequisites", 
			"description": "Point-Blank Shot, base attack bonus +6."
		}, 
		{
			"body": "<p>When an ally who also has this feat makes a ranged attack and hits an opponent within 30 feet of you, you can spend an immediate action to make a single ranged attack against that opponent. Your ranged weapon must be in hand, loaded, and ready to be fired or thrown for you to make the ranged attack. </p>", 
			"source": "Ultimate Combat", 
			"type": "section", 
			"name": "Benefits"
		}
	], 
	"source": "Ultimate Combat", 
	"feat_types": {
		"feat_type": "Teamwork"
	}, 
	"type": "feat", 
	"description": "You and your allies pelt your enemies with a deadly barrage of missiles. "
}));
