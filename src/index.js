var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var _ = require('underscore');

var Api = require('./api.js');
var Render = require('./utils/render.js');
var Rules = require('./models/rules.js');
var Core = require('./game/core.js');
require('./data/data.js');
require('./data/enchantment.js');
require('./data/fake.js');
require('./data/feats.js');
require('./data/rules.js');
require('./data/weapon_improvements.js');
require('./data/weapons.js');
require('./data/weapon_special_abilities.js');


var base = "pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Descriptions/Longbow/Composite?weapon.max_strength=2";

var def = [
	"pfsrd://Core Rulebook/Rules/Equipment/Weapons/Masterwork Weapons",
	"pfsrd://Core Rulebook/Rules/Magic Items/Weapons?enchantment.base_plus=1",
	"pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Magic Weapon Special Ability Descriptions/Holy",
	"pfsrd://Fake/Vigil",
	"pfsrd://Fake/Vigil/Falcon's Aim",
	"pfsrd://Fake/Vigil/Weapon Focus",
	"pfsrd://Fake/Vigil/Belt of Giant Strength +2"
];

var optional = [
	"pfsrd://Fake/Vigil/Flank", 
	"pfsrd://Fake/Vigil/Greater Bane",
	"pfsrd://Fake/Vigil/Judgement/Destruction",
	"pfsrd://Fake/Vigil/Judgement/Justice",
	"pfsrd://Fake/Vigil/Blessing Of Fervor/Effect/Extra Attack", 
	"pfsrd://Fake/Vigil/Spells/Heroism",
	"pfsrd://Fake/Vigil/Spells/Daybreak Arrow",
	"pfsrd://Fake/Vigil/Spells/Flames of the Faithful",
	"pfsrd://Fake/Vigil/Spells/Wrath",
	"pfsrd://Fake/Vigil/Spells/Divine Favor",
	"pfsrd://Ultimate Combat/Feats/Enfilading Fire", 
	"pfsrd://Core Rulebook/Feats/Manyshot", 
	"pfsrd://Core Rulebook/Feats/Point-Blank Shot", 
	"pfsrd://Core Rulebook/Feats/Rapid Shot", 
];
/*
var base = "pfsrd://Ultimate Equipment/Rules/Arms And Armor/Weapons/Weapon Descriptions/Longsword";

var def = [
	"pfsrd://Core Rulebook/Rules/Equipment/Weapons/Masterwork Weapons",
	"pfsrd://Core Rulebook/Rules/Magic Items/Weapons?enchantment.base_plus=3",
	"pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Magic Weapon Special Ability Descriptions/Keen",
	"pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Magic Weapon Special Ability Descriptions/Flaming",
	"pfsrd://Fake/Vigil",
];

var optional = [];
*/
Render.renderOptions(base, def, optional);
