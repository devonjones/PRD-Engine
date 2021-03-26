var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var _ = require('underscore');

var Api = require('../api.js');
var Rules = require('../models/rules.js');
var Core = require('../game/core.js');
var Utils = require('../game/utils.js');

function rollDie(die) {
	var parts = die.split("d");
	if (parts.length != 2) {
		throw new Error("Malformed die: " + die);
	}
	var count = parseInt(parts[0]);
	var sides = parseInt(parts[1]);
	results = [];
	for(i = 0; i < count; i++) {
		results.push(getRandomInt(1,sides));
	}
	return results;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.renderOptions = function(base, def, optional) {
	var results = "";
	_.each(optional, function(option) {
		var rule = Rules.getRule(option);
		results += "<input type='checkbox' name='ruleOption' value='";
		results += option;
		results += "'>";
		results += rule.get('name');
		results += "<br>\n";
	});
	$('#options').html(results);


	function renderAll() {
		var renderable = Core.createRenderable(Rules.getRule(base));
		_.each(def, function(url) {
			Core.applyGameObjects(renderable,
				Rules.getRule(url)); 
		});
		_.each($('input[name=ruleOption]'), function(optionBox) {
			if (optionBox.checked) {
				Core.applyGameObjects(renderable,
					Rules.getRule(optionBox.value));
			}
		});
		renderWeaponGenerator(renderable);
		render(renderable);
		renderCalculations(renderable);
		console.log(renderable);
	}

	renderAll();
	_.each($('input[name=ruleOption]'), function(optionBox) {
		optionBox.onchange = renderAll;
	});
}

function renderAttack(renderable, attack, roll, crit) {
	var results = "";
	var thb = renderable.weapon.to_hit_modifier.get('value');
	var bonus = thb + attack['penalty'];
	if(crit) {
		crit += renderable.weapon.crit_confirm_modifier.get('value');
	}
	results += "1d20 (" + roll + ") " + bonus + " = <b>" + (bonus + roll) + "</b><br>\n";
	if (roll == 1) {
		results += "Natural 1, miss<br>\n";
	} else {
		var times = 1;
		if(!crit) {
			times = attack['gen_damage_times'];
		}
		for (var i = 0; i < times; i++) {
			results += renderDamage(renderable, crit);
		}
	}
	return results
}

function toggleDamage() {
	if ($(this).hasClass("disabled")) {
		$(this).removeClass("disabled");
	} else {
		$(this).addClass("disabled");
	}
	var total = 0;
	var damage = $(this).parent();
	_.each(damage.find('.roll-component'), function(comp) {
		if(!($(comp).hasClass("disabled"))) {
			var num = comp.children[0].innerText;
			total += parseInt(num);
		}
	});
	damage.find('.roll-results').html(total);
}

function renderDamage(renderable, crit) {
	var results = "";
	var total = 0;
	var times = 1;
	var guid = Utils.guid();
	if(crit) {
		times = renderable.weapon.crit_mult.get('value') - 1;
	}
	results += "<span id='" + guid +"'>Damage: ";
	for (var i = 0; i < times; i++) {
		var die = renderable.weapon.damage.get('value');
		var dmgMod = renderable.weapon.damage_modifier.get('value');
		if(crit) {
			dmgMod += renderable.weapon.crit_damage_modifier.get('value');
		}
		var dmgRoll = rollDie(die);
		var sum = dmgRoll.reduce(function(pv, cv) { return pv + cv; }, 0);
		results += "<span class='roll-component'>[" + die + " (" + dmgRoll + ") + " + dmgMod + " = <b> ";
		results += (dmgMod + sum);
		results += "</b>]</span> ";
		total += dmgMod + sum;
	}
	var bonus_damage = null;
	if(crit && "crit_bonus_damage" in renderable.weapon) {
		bonus_damage = renderable.weapon.crit_bonus_damage.get('value');
	} else if(!crit && "bonus_damage" in renderable.weapon) {
		bonus_damage = renderable.weapon.bonus_damage.get('value');
	}
	if (bonus_damage) {
		_.each(bonus_damage, function(dam) {
			var die = dam["damage"];
			var dmgRoll = rollDie(die);
			var sum = dmgRoll.reduce(function(pv, cv) { return pv + cv; }, 0);
			results += dam["type"] + ": ";
			results += "<span class='roll-component'>[" + die + " (" + dmgRoll + ") = <b> ";
			results += sum;
			results += "</b>]</span> ";
			total += sum;
		});
	}
	results += " Total: <b><span class='roll-results'>" + total + "</span></b></span><br>\n";
	return results;
}


function renderWeaponGenerator(renderable) {
	var results = "<button type='button' id='attack_roller'>Roll attack</button>";
	results += "<div id='roller_results'></div>";
	$('#roller').html(results);

	function rollAttack() {
		var results = "";
		var attacks = renderable.wielder.full_attack.get('value');
		_.each(attacks, function(attack) {
			var roll = rollDie("1d20")[0];
			results += renderAttack(renderable, attack, roll, false);
			results += "<br>\n";
			var critRange = renderable.weapon.crit_range.get('value');
			if(roll > (20 - critRange)) {
				roll = rollDie("1d20")[0];
				results += "Crit Threat: ";
				results += renderAttack(renderable, attack, roll, true);
				results += "<br>\n";
			}
		});
		$('#roller_results').html(results);
		_.each($('#roller_results').find(".roll-component"), function(comp) {
			comp.onclick = toggleDamage;
		});
	}

	$('#attack_roller')[0].onclick = rollAttack;
}

var render = module.exports.render = function(renderable) {
	var results = renderWeapon(renderable);
	$('#main').html(results);
}

function renderName(renderable) {
	var results = "";
	var name = renderable.section.name.get('value').join(seperator=" ");
	results += "<h1 class='title-1'>" + name + "</h1>\n";
	return results;
}

var renderCalculations = module.exports.renderCalculations = function(renderable) {
	$('#calculations').empty();
	calculations = "<H2>Calculated Values</H2>\n";
	_.each(renderable.contexts, function(context) {
		calculations += "<H3>" + context + "</H3>\n";
		calculations += "<ul>";
		_.each(renderable[context], function(variable, name) {
			calculations += "<li><span class='detail-title'>" + name + ":</span> <span class='detail-value'>";
			var value = variable.get('value');
			if(typeof value == "object") {
				calculations += JSON.stringify(value);
			} else {
				calculations += value;
			}
			calculations += "<ul>";
			_.each(variable.get('modifiers'), function(modifier) {
				calculations += "<li>";
				var comma = "";
				_.each(modifier.attributes, function(value, key) {
					if (key != 'guid') {
						if(typeof value == "object") {
							calculations += comma + key + ": " + JSON.stringify(value);
						} else {
							calculations += comma + key + ": " + value;
						}
					}
					comma = ", ";
				});
				calculations += "</li>\n"
			});
			calculations += "</ul>\n";
			calculations += "</span><br>\n";
			calculations += "</li>\n";
		});
		calculations += "</ul>\n";
	});
	$('#calculations').html(calculations);
}

function renderAura(renderable) {
	var results = "";
	var aura_strengths = ["Faint", "Moderate", "Strong", "Overwhelming"];
	var final_aura = {};
	_.each(renderable.enchantment.aura.get('value'), function(aura) {
		if(aura['aura'] in final_aura) {
			var strength = _.indexOf(aura_strengths, final_aura[aura['aura']]);
			if('strength' in aura) {
				if(_.indexOf(aura_strengths, aura['strength']) > strength) {
					final_aura[aura['aura']] = aura['strength'];
				}
			}
		} else {
			final_aura[aura['aura']] = "";
			if('strength' in aura) {
				final_aura[aura['aura']] = aura['strength'];
			}
		}
	});
	var pieces = [];
	_.each(final_aura, function(value, key) {
		pieces.push(value + " " + key);
	});
	results += pieces.join(", ");
	return results;
}
function renderWeapon(renderable) {
	var results = "";
	results += "<p class='stat-block-title'><b>";
	results += renderable.section.name.get('value').join(seperator=" ");
	results += "</b></p>";
	if ("enchantment" in renderable) {
		results += "<p class='stat-block-1'><b>Aura</b> ";
		results += renderAura(renderable);
		results += ";<b> CL </b>";
		var cl = renderable.enchantment.caster_level.get('value');
		if(cl == 0) {
			results += "&mdash;";
		} else if (cl == 1) {
			results += "1st";
		} else if (cl == 2) {
			results += "2nd";
		} else if (cl == 3) {
			results += "3rd";
		} else {
			results += cl + "th";
		}
		results += "</p>";
	} else {
		results += "<p class='stat-block-1'><b>Aura</b>no aura (nonmagical)";
		results += ";<b> CL </b>&mdash;</p>";
	}
	results += "<p class='stat-block-1'>";
	var semi = "";
	if ("slot" in renderable.item) {
		results += "<b>Slot</b> ";
		results += renderable.item.slot.get('value');
		semi = "; ";
	}
	if ("cost" in renderable.item) {
		results += semi;
		semi = "; ";
		results += "<b>Price</b> ";
		results += renderable.item.cost.get('value');
		results += " gp";
	}
	if ("weight" in renderable.item) {
		results += semi;
		semi = "; ";
		results += "<b>Weight</b> ";
		results += renderable.item.weight.get('value');
		results += " lbs.";
	}
	if ("armor_class" in renderable.item) {
		results += semi;
		semi = "; ";
		results += "<b>Armor Class</b> ";
		results += renderable.item.armor_class.get('value');
	}
	if ("hit_points" in renderable.item) {
		results += semi;
		semi = "; ";
		results += "<b>Hit Points</b> ";
		results += renderable.item.hit_points.get('value');
	}
	if ("hardness" in renderable.item) {
		results += semi;
		semi = "; ";
		results += "<b>Hardness</b> ";
		results += renderable.item.hardness.get('value');
	}
	results += "</p>";
	results += renderWeaponTable(renderable);
	results += "<p class = 'stat-block-breaker'>DESCRIPTION</p>";
	_.each(renderable.history, function(history) {
		var section = Rules.getRule(history);
		if (section.get('name')) {
			results += "<h3 class='title-3'>" + section.get('name') + "</h3>\n";
		}
		if (section.get('body')) {
			results += section.get('body');
		}
	});
	if ("enchantment" in renderable) {
		results += "<p class = 'stat-block-breaker'>Construction</p>";
		results += "<p class='stat-block-1'><b>Requirements</b> ";
		var requirements = [];
		_.each(renderable.enchantment.requirements.get('value'), function(req) {
			requirements.push(req["name"]);
		});
		results += requirements.join(", ");
		results += "; <b>Skills </b>";
		results += renderable.enchantment.skill.get('value').join(", ");
		results += "; <b>Cost </b>";
		var cost = renderable.item.cost.get('value') / 2;
		results += cost;
		results += "gp</p>";
	}
	return results;
}

function renderToHitBonus(renderable) {
	var thb = renderable.weapon.to_hit_modifier.get('value');
	var attacks = renderable.wielder.full_attack.get('value');
	var results = "";
	if (thb == 0 && attacks.length == 0) {
		results += "&ndash;";
	} else {
		var slash = "";
		_.each(attacks, function(attack) {
			var bonus = thb + attack['penalty'];
			results += slash; 
			if (bonus > 0) {
				results += "+";
			}
			results += bonus;
			slash = "/";
		});
	}
	return results;
}

function renderWeaponTable(renderable) {
	var results = "";
	var tags = renderable.section.tags.get("value");
	results += "<table><thead><tr><th>";
	if(Api.hasTag(renderable, "Weapon.Martial")) {
		results += "Martial Weapons";
	} else if (Api.hasTag(renderable, "Weapon.Simple")) {
		results += "Simple Weapons";
	} else if (Api.hasTag(renderable, "Weapon.Exotic")) {
		results += "Exotic Weapons";
	}
	results += "</th><th>Cost</th><th>To Hit</th><th>Dmg</th><th>Critical</th><th>Range</th><th>Weight</th><th>Type</th><th>Special</th></thead></tr>";
	results += "<tbody>";
	results += "<tr><td colspan='9'><i>";
	if(Api.hasTag(renderable, "Weapon.Unarmed")) {
		results += "Unarmed Attacks";
	} else if (Api.hasTag(renderable, "Weapon.Melee")) {
		if(Api.hasTag(renderable, "Weapon.Light")) {
			results += "Light Melee Weapons";
		} else if (Api.hasTag(renderable, "Weapon.OneHanded")) {
			results += "One-Handed Melee Weapons";
		} else if (Api.hasTag(renderable, "Weapon.TwoHanded")) {
			results += "Two-Handed Melee Weapons";
		}
	} else if (Api.hasTag(renderable, "Weapon.Ranged")) {
		results += "Ranged Weapons";
	}
	results += "</i></td></tr>";
	results += "<tr><td class='indent-1'>" + renderable.section.name.get('value').join(seperator=" ") + "</td>";
	results += "<td>" + renderable.item.cost.get('value') + "</td>";
	results += "<td>" + renderToHitBonus(renderable) + "</td>";
	results += "<td>" + renderable.weapon.damage.get('value');
	var db = renderable.weapon.damage_modifier.get('value');
	if (db > 0) {
		results += "+";
	}
	if (db != 0) {
		results += db;
	}
	results += "</td>";
	results += "<td>";
	var crit_range = renderable.weapon.crit_range.get('value');
	if(crit_range > 1) {
		var bottom = 20 - crit_range + 1;
		results += bottom + "&ndash;20/";
	}
	results += "&times;" + renderable.weapon.crit_mult.get('value') + "</td>";
	var range = renderable.weapon.range.get('value');
	if (range == 0) {
		range = "&mdash;";
	}
	results += "<td>" + range + "</td>";
	results += "<td>" + renderable.item.weight.get('value') + " lbs.</td>";
	results += "<td>" + renderable.weapon.type.get('value').get().join("/") + "</td>";
	var special = renderable.weapon.special.get('value').slice(0);
	if("bonus_damage" in renderable.weapon) {
		_.each(renderable.weapon.bonus_damage.get('value'), function(dam) {
			special.push(dam['type'] + ": " + dam["damage"]);
		});
	}
	if (special.length == 0) {
		special = "&mdash;";
	} else {
		special = special.join(", ");
	}
	results += "<td>" + special + "</td></tr><tbody></table>";
	return results;
}


// Render functions

function renderSection(section, variables, h) {
	var results = "";
	if (section['type'] in renderers) {
		renderer = renderers[section['type']]
		results += renderer.renderHeader(section, variables);
		results += renderer.renderTitle(section, variables, h);
		results += renderer.renderDetails(section, variables);
		results += renderer.renderBody(section, variables);
		results += renderer.renderFooter(section, variables);
		forEach(section['sections'], function(subsection) {
			results += renderSection(subsection, variables, h + 1);
		});
	}
	return results;
}

function renderFieldCalculationResults(section, variables, field_name) {
	if (field_name in variables) {
		field = variables[field_name];
		results = " <span class='calculation-results'>&lt;";
		if ('format' in field) {
			if ('pre' in field['format']) {
				results += field['format']['pre'];
			}
		}
		results += field['value']
		if ('format' in field) {
			if ('post' in field['format']) {
				results += field['format']['post'];
			}
		}
		results += "&gt;</span>";
		return results;
	}
	return "";
}

function renderFieldBasic(section, variables, field_name) {
	if(field_name in section) {
		results = "<span class='detail-title'>" + underToCapital(field_name) + ":</span> <span class='detail-value'>"
			+ section[field_name];
		results += renderFieldCalculationResults(section, variables, field_name);
		results += "</span></br>\n";
		return results
	}
	return "";
}

var defaultRenderHeader = function (section, variables) {
	return "";
};

var defaultRenderTitle = function (section, variables, h) {
	results = "";
	if ('name' in section) {
		results += "<h" + h + " class='title-" + h + "'>" + section['name'] + "</h" + h + ">\n";
	}
	return results;
};

var statBlockRenderTitle = function (section, variables, h) {
	results = "";
	if ('name' in section) {
		results += "\n<p class='stat-block-title'><font color='white'>";
		results += section['name'];
		results += "</font></a></p>\n";
	}
	return results;
};

var defaultRenderDetails = function (section, variables) {
	return "";
};

var defaultRendererBody = function (section, variables) {
	if ('text' in section) {
		return section['text'];
	}
	return "";
};

var defaultRendererFooter = function (section, variables) {
	return "";
};

var renderers = {
	"ability": {
		"renderHeader": defaultRenderHeader,
		"renderTitle": function (section, variables, h) {
			var results = "";
			if ('name' in section) {
				name = section['name'];
				if ('ability_types' in section) {
					name += " (";
					comma = "";
					forEach(section['ability_types'], function(ability_type) {
						name += comma;
						if (ability_type == "Extraordinary") {
							name += "Ex";
						} else if (ability_type == "Supernatural") {
							name += "Su";
						} else if (ability_type == "Spell-Like") {
							name += "Sp";
						}
						comma = ", ";
					});
					name += ")";
				}
				results += "<h" + h + " class='title-" + h + "'>" + name + "</h" + h + ">\n";
			}
			return results;
		},
		"renderDetails": defaultRenderDetails,
		"renderBody": defaultRendererBody,
		"renderFooter": defaultRendererFooter
	},
	"affliction": {
		"renderHeader": defaultRenderHeader,
		"renderTitle": statBlockRenderTitle,
		"renderDetails": function (section, variables) {
			var results = "";
			var contracted = "";
			if ('contracted' in section) {
				contrated = section['subtype'] + ", " + section['contracted'];
			} else {
				contrated = section['subtype'];
			}
			results += "<span class='detail-title'>Contracted:</span> <span class='detail-value'>" + contrated + "</span></br>\n";
			results += renderFieldBasic(section, variables, 'save');
			results += renderFieldBasic(section, variables, 'onset');
			results += renderFieldBasic(section, variables, 'frequency');
			results += renderFieldBasic(section, variables, 'effect');
			results += renderFieldBasic(section, variables, 'initial_effect');
			results += renderFieldBasic(section, variables, 'secondary_effect');
			results += renderFieldBasic(section, variables, 'cure');
			results += renderFieldBasic(section, variables, 'cost');
			if (contracted != null) {
				contracted = subtype + ", " + contracted;
			} else {
				contracted = subtype;
			}
			return results;
		},
		"renderBody": defaultRendererBody,
		"renderFooter": defaultRendererFooter
	},
	"feat": {
		"renderHeader": defaultRenderHeader,
		"renderTitle": defaultRenderTitle,
		"renderDetails": function (section, variables) {
			results = "";
			if ('feat_types' in section) {
				results += "<span class='subtitle'>";
				forEach(section['feat_types'], function(feat_type) {
					results += feat_type + " ";
				});
				results += "</span><br>\n";
			}
			results += renderFieldBasic(section, variables, 'source');
			return results;
		},
		"renderBody": defaultRendererBody,
		"renderFooter": defaultRendererFooter
	},
	"section": {
		"renderHeader": defaultRenderHeader,
		"renderTitle": defaultRenderTitle,
		"renderDetails": defaultRenderDetails,
		"renderBody": defaultRendererBody,
		"renderFooter": defaultRendererFooter
	},
	"spell": {
		"renderHeader": defaultRenderHeader,
		"renderTitle": defaultRenderTitle,
		"renderDetails": function (section, variables) {
			results = "";
			if('school' in section) {
				results += "<span class='detail-title'>School:</span> <span class='detail-value'>" + section['school'];
				if('subschool_text' in section) {
					results += " (" + section['subschool_text'] + ")";
				}
				if('descriptor_text' in section) {
					results += " [" + section['descriptor_text'] + "]";
				}
				results += "</span></br>\n";
			}
			results += "<span class='detail-title'>Level:</span> <span class='detail-value'>";
			first = true;
			forEach(section['level'], function(level) {
				if(!first) {
					results += "; ";
				}
				results += level['class'] + ": " + level.level;
				first = false;
			});
			results += renderFieldCalculationResults(section, variables, 'level');
			results += "</span></br>\n";
			results += renderFieldBasic(section, variables, 'casting_time');
			results += renderFieldBasic(section, variables, 'preparation_time');
			if('component_text' in section) {
				results += "<span class='detail-title'>Components:</span> <span class='detail-value'>" + section['component_text'];
				results += "</span></br>\n";
			}
			results += renderFieldBasic(section, variables, 'range');
			if('effects' in section) {
				forEach(section['effects'], function(effect) {
					results += "<span class='detail-title'>" + effect['name'] + ":</span> <span class='detail-value'>" + effect['text'];
					results += renderFieldCalculationResults(section, variables, effect['name'].toLowerCase());
					results += "</span></br>\n";
				});
			}
			results += renderFieldBasic(section, variables, 'duration');
			results += renderFieldBasic(section, variables, 'saving_throw');
			results += renderFieldBasic(section, variables, 'spell_resistance');
			results += renderFieldBasic(section, variables, 'source');
			if('description' in section) {
				results += "<span class='detail-title'>Summary:</span> <span class='detail-value'>" + section['description'];
				results += "</span></br>\n";
			}
			return results;
		},
		"renderBody": defaultRendererBody,
		"renderFooter": defaultRendererFooter
	},
	"table": {
		"renderHeader": defaultRenderHeader,
		"renderTitle": function (section, variables) {
			return "";
		},
		"renderDetails": defaultRenderDetails,
		"renderBody": defaultRendererBody,
		"renderFooter": defaultRendererFooter
	},
}

// Utility Functions

function underToCapital(string) {
	results = "";
	spstr = string.split("_");
	forEach(spstr, function(word) {
		results += capitalize(word) + " ";
	});
	return results;
}

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function max(list) {
	return Math.max.apply(null, list);
}

function clone(obj) {
	if(null == obj || "object" != typeof obj) return obj;
	var copy = obj.constructor();
	for(var attr in obj) {
		if(obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
	}
	return copy;
}

function forEach(list, action) {
	for (var i in list) {
		action(list[i]);
	}
}

function isNumeric(num){
	return !isNaN(num)
}
