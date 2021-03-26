var Rules = require('../src/models/rules.js');
var Core = require('../src/game/core.js');
var GameObject = require('../src/models/game_object.js');

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/VarRecalculate1", 
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
				{"variable": "number", "formula": "$.getVariable(renderable, this, '$.section.data')"}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/VarRecalculate2", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"test": {
			"modifiers": [
				{"variable": "$.section.data", "formula": "2"}
			]
		}
	}
}));

describe("Verify Recalculate", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/VarRecalculate1"));
	Core.applyGameObjects(renderable,
		Rules.getRule("pfsrd://Tests/VarRecalculate2"));
	it("has recalculated", function() {
		expect(renderable.section.number.get('value')).toEqual(3);
	});
});

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/VarType1", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"test": {
			"variables": [
				{"variable": "number", "type": "number"},
			],
			"modifiers": [
				{"variable": "number", "formula": "2", "type": "foo"}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/VarType2", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"test": {
			"modifiers": [
				{"variable": "number", "formula": "3", "type": "foo"}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/VarType3", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"test": {
			"modifiers": [
				{"variable": "number", "formula": "3", "type": "bar"}
			]
		}
	}
}));

describe("Verify type stacking", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/VarType1"));
	Core.applyGameObjects(renderable,
		Rules.getRule("pfsrd://Tests/VarType2"));
	Core.applyGameObjects(renderable,
		Rules.getRule("pfsrd://Tests/VarType3"));
	it("type has properly stacked", function() {
		expect(renderable.test.number.get('value')).toEqual(6);
	});
});

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/VarCondition1", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"test": {
			"variables": [
				{"variable": "number", "type": "number"},
				{"variable": "data", "type": "number", "default": 1},
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/VarCondition2", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"test": {
			"conditions": [
				{
					"text": "Must be masterwork",
					"formula": "$.getVariable(renderable, this, '$.test.data') > 0"
				}
			],
			"modifiers": [
				{"variable": "number", "formula": "3", "type": "foo"}
			]
		}
	}
}));

describe("Verify Pass Condition", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/VarCondition1"));
	Core.applyGameObjects(renderable,
		Rules.getRule("pfsrd://Tests/VarCondition2"));
	it("rule has been added", function() {
		expect(renderable.test.number.get('value')).toEqual(3);
	});
});


Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/VarAutoParameter1", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"variables": [
				{"variable": "number", "type": "number"},
				{"variable": "data", "type": "number", "default": 1},
				{"variable": "string", "type": "string"}
			]
		}
	}
}));

describe("Verify url args work", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/VarAutoParameter1?section.data=2&section.number=5&section.string=yermom"));
	it("has proper default", function() {
		expect(renderable.section.number.get('value')).toEqual(5);
		expect(renderable.section.data.get('value')).toEqual(2);
		expect(renderable.section.string.get('value')).toEqual("yermom");
	});
});

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/VarAutoParameterBad1", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"variables": [
				{"variable": "number", "type": "number"}
			]
		}
	}
}));

describe("Verify url args error wrong variable type", function() {
	it("has proper default", function() {
		expect( function(){ Core.createRenderable(Rules.getRule("pfsrd://Tests/VarAutoParameterBad1?section.number=foo")); } ).toThrow(new Error("section.number with value: foo is not a number."));
	});
});

