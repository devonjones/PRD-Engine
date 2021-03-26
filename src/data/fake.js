var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var GameObject = require('../models/game_object.js');
var Rules = require('../models/rules.js');

Rules.addRule(new GameObject({
	"body": "", 
	"url": "pfsrd://Fake/Character", 
	"type": "section", 
	"name": "Base Character", 
	"source": "Core Rulebook",
	"dependencies": [
	],
	"apply": {
		"inquisitor": {
			"context": true
		},
		"combat": {
			"context": true,
			"variables": [
				{"variable": "bab", "type": "number", "default": 0}
			],
		},
		"attributes": {
			"context": true,
			"variables": [
				{"variable": "strength", "type": "number"},
				{"variable": "str_mod", "type": "number"},
				{"variable": "dexterity", "type": "number"},
				{"variable": "dex_mod", "type": "number"},
				{"variable": "constitution", "type": "number"},
				{"variable": "con_mod", "type": "number"},
				{"variable": "intelligence", "type": "number"},
				{"variable": "int_mod", "type": "number"},
				{"variable": "wisdom", "type": "number"},
				{"variable": "wis_mod", "type": "number"},
				{"variable": "charisma", "type": "number"},
				{"variable": "cha_mod", "type": "number"},
			],
			"modifiers": [
				{"variable": "str_mod", "formula": "($.getVariable(renderable, this, '$.attributes.strength') - 10) / 2"},
				{"variable": "dex_mod", "formula": "($.getVariable(renderable, this, '$.attributes.dexterity') - 10) / 2"},
				{"variable": "con_mod", "formula": "($.getVariable(renderable, this, '$.attributes.constitution') - 10) / 2"},
				{"variable": "int_mod", "formula": "($.getVariable(renderable, this, '$.attributes.intelligence') - 10) / 2"},
				{"variable": "wis_mod", "formula": "($.getVariable(renderable, this, '$.attributes.wisdom') - 10) / 2"},
				{"variable": "cha_mod", "formula": "($.getVariable(renderable, this, '$.attributes.charisma') - 10) / 2"}
			]
		},
		"wielder": {
			"modifiers": [
				{"variable": "bab", "formula": "$.getVariable(renderable, this, '$.combat.bab')"},
				{"variable": "to_hit_stat_mod", "formula": "$.getVariable(renderable, this, $.getVariable(renderable, this, '$.wielder.to_hit_stat'))"},
				{"variable": "damage_stat_mod", "formula": "$.getVariable(renderable, this, $.getVariable(renderable, this, '$.wielder.damage_stat'))"}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "", 
	"url": "pfsrd://Fake/Vigil", 
	"type": "section", 
	"name": "Vigil", 
	"source": "Core Rulebook",
	"dependencies": [
		"pfsrd://Fake/Character", 
	],
	"apply": {
		"inquisitor": {
			"variables": [
				{"variable": "level", "type": "number", "default": 12}
			]
		},
		"combat": {
			"modifiers": [
				{"variable": "bab", "formula": "11"}
			]
		},
		"attributes": {
			"modifiers": [
				{"variable": "strength", "formula": "12"},
				{"variable": "dexterity", "formula": "16"},
				{"variable": "constitution", "formula": "14"},
				{"variable": "intelligence", "formula": "10"},
				{"variable": "wisdom", "formula": "18"},
				{"variable": "charisma", "formula": "10"},
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "", 
	"url": "pfsrd://Fake/Vigil/Belt of Giant Strength +2",
	"type": "section", 
	"name": "Belt of Giant Strength +2", 
	"source": "Core Rulebook",
	"dependencies": [
	],
	"apply": {
		"attributes": {
			"modifiers": [
				{"variable": "strength", "formula": "2", "type": "enhancement"}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "", 
	"url": "pfsrd://Fake/Vigil/Falcon's Aim", 
	"type": "section", 
	"name": "Falcon's Aim", 
	"source": "Core Rulebook",
	"dependencies": [
	],
	"apply": {
		"weapon": {
			"modifiers": [
				{"variable": "to_hit_modifier", "formula": "1", "type": "competence"},
				{"variable": "crit_range", "formula": "1", "bonus_type": "keen"}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "", 
	"url": "pfsrd://Fake/Vigil/Flank", 
	"type": "section", 
	"name": "Flanking", 
	"source": "Core Rulebook",
	"dependencies": [
	],
	"apply": {
		"weapon": {
			"modifiers": [
				{"variable": "to_hit_modifier", "formula": "2", "type": "flanking"},
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "", 
	"url": "pfsrd://Fake/Vigil/Bane", 
	"type": "section", 
	"name": "Bane", 
	"source": "Core Rulebook",
	"dependencies": [
	],
	"apply": {
		"enchantment": {
			"modifiers": [
				{"variable": "plus", "formula": "2"},
			]
		},
		"weapon": {
			"lists": [
				{"variable": "bonus_damage", "operation": "push", "value": [
					{"damage": "2d6", "type": "bane"}
				]}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "", 
	"url": "pfsrd://Fake/Vigil/Weapon Focus", 
	"type": "section", 
	"name": "Bane", 
	"source": "Core Rulebook",
	"dependencies": [
	],
	"apply": {
		"weapon": {
			"modifiers": [
				{"variable": "to_hit_modifier", "formula": "1", "type": "weapon_focus"},
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "", 
	"url": "pfsrd://Fake/Vigil/Greater Bane", 
	"type": "section", 
	"name": "Greater Bane", 
	"source": "Core Rulebook",
	"dependencies": [
	],
	"apply": {
		"enchantment": {
			"modifiers": [
				{"variable": "plus", "formula": "2"},
			]
		},
		"weapon": {
			"lists": [
				{"variable": "bonus_damage", "operation": "push", "value": [
					{"damage": "4d6", "type": "bane"}
				]}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "", 
	"url": "pfsrd://Fake/Vigil/Judgement/Destruction", 
	"type": "section", 
	"name": "Judgement: Destruction", 
	"source": "Core Rulebook",
	"dependencies": [
	],
	"apply": {
		"weapon": {
			"modifiers": [
				{"variable": "damage_modifier", "formula": "$.floor($.getVariable(renderable, this, '$.inquisitor.level') / 3) + 1", "type": "sacred"}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "", 
	"url": "pfsrd://Fake/Vigil/Judgement/Justice", 
	"type": "section", 
	"name": "Judgement: Justice", 
	"source": "Core Rulebook",
	"dependencies": [
	],
	"apply": {
		"weapon": {
			"modifiers": [
				{"variable": "to_hit_modifier", "formula": "$.floor($.getVariable(renderable, this, '$.inquisitor.level') / 5) + 1", "type": "sacred"}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "", 
	"url": "pfsrd://Fake/Vigil/Spells/Heroism", 
	"type": "section", 
	"name": "Heroism", 
	"source": "Core Rulebook",
	"dependencies": [
	],
	"apply": {
		"weapon": {
			"modifiers": [
				{"variable": "to_hit_modifier", "formula": "2", "type": "morale"}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "", 
	"url": "pfsrd://Fake/Vigil/Spells/Daybreak Arrow", 
	"type": "section", 
	"name": "Daybreak Arrow", 
	"source": "Core Rulebook",
	"dependencies": [
	],
	"apply": {
		"weapon": {
			"lists": [
				{"variable": "bonus_damage", "operation": "push", "value": [
					{"damage": "1d6", "type": "vs. undead"}
				]}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "", 
	"url": "pfsrd://Fake/Vigil/Spells/Flames of the Faithful", 
	"type": "section", 
	"name": "Flames of the Faithful", 
	"source": "Core Rulebook",
	"dependencies": [
	],
	"apply": {
		"weapon": {
			"lists": [
				{"variable": "bonus_damage", "operation": "push", "value": [
					{"damage": "1d6", "type": "flaming"}
				]}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "", 
	"url": "pfsrd://Fake/Vigil/Spells/Wrath", 
	"type": "section", 
	"name": "Wrath", 
	"source": "Core Rulebook",
	"dependencies": [
	],
	"apply": {
		"weapon": {
			"modifiers": [
				{"variable": "to_hit_modifier", "formula": "3", "type": "morale"},
				{"variable": "damage_modifier", "formula": "3", "type": "morale"},
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "", 
	"url": "pfsrd://Fake/Vigil/Spells/Divine Favor", 
	"type": "section", 
	"name": "Divine Favor", 
	"source": "Core Rulebook",
	"dependencies": [
	],
	"apply": {
		"weapon": {
			"modifiers": [
				{"variable": "to_hit_modifier", "formula": "3", "type": "luck"},
				{"variable": "damage_modifier", "formula": "3", "type": "luck"},
			]
		}
	}
}));


Rules.addRule(new GameObject({
	"description": "Make one extra attack as part of a full attack action, using its highest base attack bonus.",
	"url": "pfsrd://Fake/Vigil/Blessing Of Fervor/Effect/Extra Attack", 
	"source": "Advanced Player's Guide", 
	"name": "Blessing of Fervor: Extra Attack", 
	"type": "section", 
	"apply": {
		"wielder": {
			"lists": [
				{"variable": "full_attack", "operation": "unshift", "formula": "$.Weapon.createStandardAttack()"}
			]
		}
	}
}));

