var Set = require('set');
var Rules = require('../src/models/rules.js');
var Core = require('../src/game/core.js');
var GameObject = require('../src/models/game_object.js');

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/SetAdd", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"variables": [
				{"variable": "set", "type": "set", "default": ["A", "B"]}
			],
			"sets": [
				{"variable": "set", "operation": "add", "value": "C"}
			]
		}
	}
}));

describe("Verify Add", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/SetAdd"));
	it("has had C added", function() {
		expect(renderable.section.set.get('value').get()).toEqual(["A", "B", "C"]);
	});
});

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/SetRemove", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"variables": [
				{"variable": "set", "type": "set", "default": ["A", "B"]}
			],
			"sets": [
				{"variable": "set", "operation": "remove", "value": "B"}
			]
		}
	}
}));

describe("Verify Remove", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/SetRemove"));
	it("has had B removed", function() {
		expect(renderable.section.set.get('value').get()).toEqual(["A"]);
	});
});

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/SetClear", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"variables": [
				{"variable": "set", "type": "set", "default": ["A", "B"]}
			],
			"sets": [
				{"variable": "set", "operation": "clear"}
			]
		}
	}
}));

describe("Verify Clear", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/SetClear"));
	it("has been cleared", function() {
		expect(renderable.section.set.get('value').get()).toEqual([]);
	});
});

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/SetUnion", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"variables": [
				{"variable": "set", "type": "set", "default": ["A", "B"]}
			],
			"sets": [
				{"variable": "set", "operation": "union", "value": ["B", "C"]}
			]
		}
	}
}));

describe("Verify Union", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/SetUnion"));
	it("has unioned", function() {
		expect(renderable.section.set.get('value').get()).toEqual(["A", "B", "C"]);
	});
});

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/SetIntersect", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"variables": [
				{"variable": "set", "type": "set", "default": ["A", "B", "C"]}
			],
			"sets": [
				{"variable": "set", "operation": "intersect", "value": ["B", "D"]}
			]
		}
	}
}));

describe("Verify Intersect", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/SetIntersect"));
	it("has intersectioned to produce [B]", function() {
		expect(renderable.section.set.get('value').get()).toEqual(["B"]);
	});
});

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/SetDifference", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"variables": [
				{"variable": "set", "type": "set", "default": ["A", "B", "C"]}
			],
			"sets": [
				{"variable": "set", "operation": "difference", "value": ["B", "D"]}
			]
		}
	}
}));

describe("Verify Difference", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/SetDifference"));
	it("has had B removed", function() {
		expect(renderable.section.set.get('value').get()).toEqual(["A", "C", "D"]);
	});
});

