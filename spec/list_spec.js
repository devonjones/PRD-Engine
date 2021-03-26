var Rules = require('../src/models/rules.js');
var Core = require('../src/game/core.js');
var GameObject = require('../src/models/game_object.js');

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/ListShift", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"variables": [
				{"variable": "list", "type": "list", "default": ["A", "B"]}
			],
			"lists": [
				{"variable": "list", "operation": "shift"}
			]
		}
	}
}));

describe("Verify Shift", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/ListShift"));
	it("has had A shifted", function() {
		expect(renderable.section.list.get('value')).toEqual(["B"]);
	});
});

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/ListUnshift", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"variables": [
				{"variable": "list", "type": "list", "default": ["A", "B"]}
			],
			"lists": [
				{"variable": "list", "operation": "unshift", "value": "C"}
			]
		}
	}
}));

describe("Verify Unshift", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/ListUnshift"));
	it("has had C unshifted", function() {
		expect(renderable.section.list.get('value')).toEqual(["C", "A", "B"]);
	});
});

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/ListPush", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"variables": [
				{"variable": "list", "type": "list", "default": ["A", "B"]}
			],
			"lists": [
				{"variable": "list", "operation": "push", "value": "C"}
			]
		}
	}
}));

describe("Verify Push", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/ListPush"));
	it("has had C pushed", function() {
		expect(renderable.section.list.get('value')).toEqual(["A", "B", "C"]);
	});
});

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/ListPop", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"variables": [
				{"variable": "list", "type": "list", "default": ["A", "B"]}
			],
			"lists": [
				{"variable": "list", "operation": "pop"}
			]
		}
	}
}));

describe("Verify Pop", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/ListPop"));
	it("has had B popped", function() {
		expect(renderable.section.list.get('value')).toEqual(["A"]);
	});
});

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/ListInsert", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"variables": [
				{"variable": "list", "type": "list", "default": ["A", "B", "C"]}
			],
			"lists": [
				{"variable": "list", "operation": "insert", "value": "D"},
				{"variable": "list", "operation": "insert", "index": 3, "value": "E"}
			]
		}
	}
}));

describe("Verify Insert", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/ListInsert"));
	it("has had C & D inserted", function() {
		expect(renderable.section.list.get('value')).toEqual(["A", "D", "B", "E", "C"]);
	});
});

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/ListRemove", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"variables": [
				{"variable": "list", "type": "list", "default": ["A", "B", "C", "D", "E"]}
			],
			"lists": [
				{"variable": "list", "operation": "remove", "value": "A"},
				{"variable": "list", "operation": "remove", "value": "C"}
			]
		}
	}
}));

describe("Verify Remove", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/ListRemove"));
	it("has had A & C removed", function() {
		expect(renderable.section.list.get('value')).toEqual(["B", "D", "E"]);
	});
});

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/ListReplace", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"variables": [
				{"variable": "list", "type": "list", "default": ["A", "B", "C", "D", "E"]}
			],
			"lists": [
				{"variable": "list", "operation": "replace", "value": ['D', 'F']}
			]
		}
	}
}));

describe("Verify Replace", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/ListReplace"));
	it("has had the list replaced with [D, F]", function() {
		expect(renderable.section.list.get('value')).toEqual(["D", "F"]);
	});
});

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/ListRecalculate1", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"variables": [
				{"variable": "list", "type": "list", "default": ["A", "B"]},
				{"variable": "data", "type": "string", "default": "C"}
			],
			"lists": [
				{"variable": "list", "operation": "push", "formula": "$.getVariable(renderable, this, '$.section.data')"}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/ListRecalculate2", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"modifiers": [
				{"variable": "data", "formula": "'foo'"}
			]
		}
	}
}));

describe("Verify Recalculate", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/ListRecalculate1"));
	Core.applyGameObjects(renderable,
		Rules.getRule("pfsrd://Tests/ListRecalculate2"));
	it("has recalculated", function() {
		expect(renderable.section.list.get('value')).toEqual(["A", "B", "foo"]);
	});
});

