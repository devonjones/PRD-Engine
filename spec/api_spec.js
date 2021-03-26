var Rules = require('../src/models/rules.js');
var Core = require('../src/game/core.js');
var GameObject = require('../src/models/game_object.js');

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/VarParameter1", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"variables": [
				{"variable": "number", "type": "number"},
				{"variable": "data", "type": "number", "default": 1}
			],
			"modifiers": [
				{"variable": "number", "formula": "$.getUrlArg(this, 'plus')"},
				{"variable": "number", "formula": "$.getVariable(renderable, this, '$.section.data')"}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/VarParameter2", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"modifiers": [
				{"variable": "data", "formula": "2"},
			]
		}
	}
}));

describe("Verify url args work", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/VarParameter1?plus=2"));
	Core.applyGameObjects(renderable,
		Rules.getRule("pfsrd://Tests/VarParameter2"));
	it("has recalculated", function() {
		expect(renderable.section.number.get('value')).toEqual(5);
	});
});

