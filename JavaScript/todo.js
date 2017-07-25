#include json2.js

// [+] Learn how to change text
// [+] How to save JPEG
// [+] How to read JSON

(function main() {

	var lessons = loadJson('lessons.json');

	for (var i = 0; i < lessons.length; i++) {
		var lesson = lessons[i];
		processLesson(lesson);
	}

})();

function processLesson(lesson) {
	var doc = app.activeDocument;

	var titleGroup = doc.layerSets.getByName('title');
	var titleLayer = titleGroup.layers[0];
	titleLayer.textItem.contents = lesson.title;

	var todoGroup = doc.layerSets.getByName('todo');

	for (var i = 0; i < lesson.todo.length; i++) {
		var layer = todoGroup.layers[i];
		titleLayer.textItem.contents = lesson.todo[i];
	}

	titleGroup.visible = false;
	todoGroup.visible = false;

	saveGroup(titleGroup, lesson.id + '-title');
	saveGroup(todoGroup, lesson.id + '-todo');
}

function saveGroup(group, name) {
	group.visible = true;
	saveJpeg(name);
	group.visible = false;
}

function loadJson(relPath) {
	var script = new File($.fileName);
	var jsonFile = new File(script.path + '/' + relPath);

	jsonFile.open('r');
	var str = jsonFile.read();
	jsonFile.close();

	return JSON.parse(str);
}

function saveJpeg(name) {
	var doc = app.activeDocument;
	var file = new File(doc.path + '/gen/' + name + '.jpg');

	var opts = new JPEGSaveOptions();
	opts.quality = 10;

	doc.saveAs(file, opts, true);
}
