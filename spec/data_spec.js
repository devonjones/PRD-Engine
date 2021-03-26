var Rules = require('../src/models/rules.js');
var Core = require('../src/game/core.js');
var GameObject = require('../src/models/game_object.js');

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/Test1", 
	"type": "section", 
	"subtype": "test", 
	"name": "Test1", 
	"source": "Tests",
	"apply": {
		"section": {
			"variables": [
				{"variable": "list", "type": "list"},
				{"variable": "string", "type": "string"},
				{"variable": "number", "type": "number"}
			]
		},
		"test": {
			"variables": [
				{"variable": "list1", "type": "list"}
			]
		},
		"notatest": {
			"variables": [
				{"variable": "list2", "type": "list"}
			]
		}
	}
}));

Rules.addRule(new GameObject({
	"body": "text", 
	"url": "pfsrd://Tests/Test2", 
	"type": "test", 
	"subtype": "othertest", 
	"name": "Test2", 
	"source": "Tests",
	"dependencies": [
		"pfsrd://Tests/Test1",
	],
	"apply": {
		"section": {
			"lists": [
				{"variable": "list", "operation": "push", "formula": "'Test2' + '.1'"},
			],
			"modifiers": [
				{"variable": "string", "value": "Test2"},
				{"variable": "number", "formula": "2"}
			]
		},
		"test": {
			"lists": [
				{"variable": "$.section.list", "operation": "unshift", "value": "Test2.2"},
			]
		},
		"othertest": {
			"variables": [
				{"variable": "list1", "type": "list", "default": ["Test", "OtherTest"]}
			]
		},
		"notatest": {
			"lists": [
				{"variable": "$.section.list", "operation": "push", "value": "Test3"},
			]
		}
	}
}));

describe("Rule with a variable", function() {
	var test_go = Rules.getRule("pfsrd://Tests/Test1");
	it("has attributes", function() {
		expect(test_go.__name__).toEqual("GameObject");
		expect(test_go.get('body')).toEqual("text");
		expect(test_go.get('name')).toEqual("Test1");
		expect(test_go.get('source')).toEqual("Tests");
		expect(test_go.get('type')).toEqual("section");
		expect(test_go.get('subtype')).toEqual("test");
		expect(test_go.get('url')).toEqual("pfsrd://Tests/Test1");

		expect('section' in test_go.get('apply')).toEqual(true);
		var section = test_go.get('apply').section;
		expect(section.variables.length).toEqual(3);

		expect(section.variables[0].__name__).toEqual("ListVar");
		expect(section.variables[0].get('variable')).toEqual("list");
		expect(section.variables[0].get('default')).toEqual([]);
		expect(section.variables[0].get('value')).toEqual([]);

		expect(section.variables[1].__name__).toEqual("StringVar");
		expect(section.variables[1].get('variable')).toEqual("string");
		expect(section.variables[1].get('default')).toEqual("");
		expect(section.variables[1].get('value')).toEqual("");

		expect(section.variables[2].__name__).toEqual("NumberVar");
		expect(section.variables[2].get('variable')).toEqual("number");
		expect(section.variables[2].get('default')).toEqual(0);
		expect(section.variables[2].get('value')).toEqual(0);

		var test = test_go.get('apply').test;
		expect(test.variables.length).toEqual(1);

		expect(test.variables[0].__name__).toEqual("ListVar");
		expect(test.variables[0].get('variable')).toEqual("list1");
		expect(test.variables[0].get('default')).toEqual([]);
		expect(test.variables[0].get('value')).toEqual([]);

		var notatest = test_go.get('apply').notatest;
		expect(notatest.variables.length).toEqual(1);

		expect(notatest.variables[0].__name__).toEqual("ListVar");
		expect(notatest.variables[0].get('variable')).toEqual("list2");
		expect(notatest.variables[0].get('default')).toEqual([]);
		expect(notatest.variables[0].get('value')).toEqual([]);
	});
});

describe("Renderable with a variable", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/Test1"));
	it("has applied", function() {
		expect("applied" in renderable).toEqual(true);
		expect(renderable.applied.length).toEqual(1);
		expect("guid" in renderable.applied[0]).toEqual(true);
		expect(renderable.applied[0].get('url')).toEqual("pfsrd://Tests/Test1");
	});
	it("has base", function() {
		expect("base" in renderable).toEqual(true);
		expect(renderable.base.get('url')).toEqual("pfsrd://Tests/Test1");
	});
	it("has context", function() {
		expect("contexts" in renderable).toEqual(true);
		expect(renderable.contexts).toEqual(["section", "test"]);
	});
	it("has history", function() {
		expect("history" in renderable).toEqual(true);
		expect(renderable.history).toEqual(["pfsrd://Tests/Test1"]);
	});
	it("has section context", function() {
		expect("section" in renderable).toEqual(true);
	});
	var section = renderable.section;
	it("has section list variable", function() {
		expect("list" in section).toEqual(true);
		expect(section.list.get("default")).toEqual([]);
		expect(section.list.get("modifiers").length).toEqual(1);
		expect(section.list.get("modifiers")[0].get("context")).toEqual("section");
		expect(section.list.get("modifiers")[0].has("guid")).toEqual(true);
		expect(section.list.get("modifiers")[0].get("operation")).toEqual("create");
		expect(section.list.get("modifiers")[0].get("value")).toEqual([]);
		expect(section.list.get("sources")).toEqual([]);
		expect(section.list.get("value")).toEqual([]);
	});

	it("has section string variable", function() {
		expect("string" in section).toEqual(true);
		expect(section.string.get("default")).toEqual("");
		expect(section.string.get("modifiers").length).toEqual(1);
		expect(section.string.get("modifiers")[0].get("context")).toEqual("section");
		expect(section.string.get("modifiers")[0].has("guid")).toEqual(true);
		expect(section.string.get("modifiers")[0].get("formula")).toEqual("");
		expect(section.string.get("modifiers")[0].get("value")).toEqual("");
		expect(section.string.get("sources")).toEqual([]);
		expect(section.string.get("value")).toEqual("");
	});

	it("has section number variable", function() {
		expect("number" in section).toEqual(true);
		expect(section.number.get("default")).toEqual(0);
		expect(section.number.get("modifiers").length).toEqual(1);
		expect(section.number.get("modifiers")[0].get("context")).toEqual("section");
		expect(section.number.get("modifiers")[0].has("guid")).toEqual(true);
		expect(section.number.get("modifiers")[0].get("formula")).toEqual(0);
		expect(section.number.get("modifiers")[0].get("value")).toEqual(0);
		expect(section.number.get("sources")).toEqual([]);
		expect(section.number.get("value")).toEqual(0);
	});

	it("has test context", function() {
		expect("test" in renderable).toEqual(true);
	});
	it("has test list1 variable", function() {
		expect("list1" in renderable.test).toEqual(true);
	});

	it("does not have notatest context", function() {
		expect("notatest" in renderable).toEqual(false);
	});
});

describe("Rules have rule", function() {
	it("has the rule we loaded", function() {
		expect(Rules.hasRule("pfsrd://Tests/Test1")).toEqual(true);
		expect(Rules.hasRule("pfsrd://Tests/Test2")).toEqual(true);
		expect(Rules.hasRule("pfsrd://Tests/TestFail1")).toEqual(false);
		expect(Rules.getRule("pfsrd://Tests/Test1").get('url')).toEqual("pfsrd://Tests/Test1");
	});
}); 

describe("Rule applies another rule", function() {
	var renderable = Core.createRenderable(Rules.getRule("pfsrd://Tests/Test2"));
	it("has applied", function() {
		expect("applied" in renderable).toEqual(true);
		expect(renderable.applied.length).toEqual(2);
		expect(renderable.applied[0].get('url')).toEqual("pfsrd://Tests/Test2");
		expect(renderable.applied[1].get('url')).toEqual("pfsrd://Tests/Test1");
	});
	it("has base", function() {
		expect("base" in renderable).toEqual(true);
		expect(renderable.base.get('url')).toEqual("pfsrd://Tests/Test2");
	});
	it("has context", function() {
		expect("contexts" in renderable).toEqual(true);
		expect(renderable.contexts).toEqual(["section", "test", "othertest"]);
	});
	it("has history", function() {
		expect("history" in renderable).toEqual(true);
		expect(renderable.history).toEqual(["pfsrd://Tests/Test2"]);
	});

	it("has section context", function() {
		expect("section" in renderable).toEqual(true);
	});
	var section = renderable.section;
	it("has section list variable", function() {
		expect("list" in section).toEqual(true);
		expect(section.list.get("default")).toEqual([]);
		expect(section.list.get("modifiers").length).toEqual(3);
		expect(section.list.get("modifiers")[0].get("context")).toEqual("section");
		expect(section.list.get("modifiers")[0].has("guid")).toEqual(true);
		expect(section.list.get("modifiers")[0].get("operation")).toEqual("create");
		expect(section.list.get("modifiers")[0].get("value")).toEqual([]);
		expect(section.list.get("modifiers")[1].get("context")).toEqual("section");
		expect(section.list.get("modifiers")[1].has("guid")).toEqual(true);
		expect(section.list.get("modifiers")[1].get("operation")).toEqual("push");
		expect(section.list.get("modifiers")[1].get("formula")).toEqual("'Test2' + '.1'");
		expect("formula" in section.list.get("modifiers")[1]);
		expect(section.list.get("modifiers")[1].get("value")).toEqual('Test2.1');
		expect(section.list.get("modifiers")[2].get("context")).toEqual("test");
		expect(section.list.get("modifiers")[2].has("guid")).toEqual(true);
		expect(section.list.get("modifiers")[2].get("operation")).toEqual("unshift");
		expect(section.list.get("modifiers")[2].get("value")).toEqual('Test2.2');
		expect(section.list.get("sources")).toEqual([]);
		expect(section.list.get("value")).toEqual(["Test2.2", "Test2.1"]);
	});
	it("has section string variable", function() {
		expect("string" in section).toEqual(true);
		expect(section.string.get("default")).toEqual("");
		expect(section.string.get("modifiers").length).toEqual(2);
		expect(section.string.get("modifiers")[0].get("context")).toEqual("section");
		expect(section.string.get("modifiers")[0].has("guid")).toEqual(true);
		expect(section.string.get("modifiers")[0].get("formula")).toEqual("");
		expect(section.string.get("modifiers")[0].get("value")).toEqual("");
		expect(section.string.get("modifiers")[1].get("context")).toEqual("section");
		expect(section.string.get("modifiers")[1].has("guid")).toEqual(true);
		expect(section.string.get("modifiers")[1].get("formula")).toEqual("'Test2'");
		expect(section.string.get("modifiers")[1].get("value")).toEqual('Test2');
		expect(section.string.get("sources")).toEqual([]);
		expect(section.string.get("value")).toEqual("Test2");
	});
	it("has section number variable", function() {
		expect("number" in section).toEqual(true);
		expect(section.number.get("default")).toEqual(0);
		expect(section.number.get("modifiers").length).toEqual(2);
		expect(section.number.get("modifiers")[0].get("context")).toEqual("section");
		expect(section.number.get("modifiers")[0].has("guid")).toEqual(true);
		expect(section.number.get("modifiers")[0].get("formula")).toEqual(0);
		expect(section.number.get("modifiers")[0].get("value")).toEqual(0);
		expect(section.number.get("modifiers")[1].get("context")).toEqual("section");
		expect(section.number.get("modifiers")[1].has("guid")).toEqual(true);
		expect(section.number.get("modifiers")[1].get("formula")).toEqual("2");
		expect(section.number.get("modifiers")[1].get("value")).toEqual(2);
		expect(section.number.get("sources")).toEqual([]);
		expect(section.number.get("value")).toEqual(2);
	});

	it("has test context", function() {
		expect("test" in renderable).toEqual(true);
	});
	it("has test list1 variable", function() {
		expect("list1" in renderable.test).toEqual(true);
		expect(renderable.test.list1.get('value')).toEqual([]);
	});

	it("has othertest context", function() {
		expect("othertest" in renderable).toEqual(true);
	});
	it("has othertest list1 variable", function() {
		expect("list1" in renderable.othertest).toEqual(true);
		expect(renderable.othertest.list1.get('value')).toEqual(["Test", "OtherTest"]);
	});

});

