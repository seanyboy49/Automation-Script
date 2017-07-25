var srcDoc = app.activeDocument;
var hardwareGroup = srcDoc.layerSets.getByName('Hardware');
var imageLeft = hardwareGroup.layers.getByName('image-left');
var imageCenter = hardwareGroup.layers.getByName('image-center');
var imageRight = hardwareGroup.layers.getByName('image-right');

var rootPath = doc.path;

$.writeln(rootPath)

var fileList = rootPath.getFiles(/\.(png)$/i);

var doc = open(fileList[0]);

// select all
activeDocument.selection.selectAll();

// copy image
activeDocument.selection.copy();

// close image without saving because thug life
app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);

// select the source image
activeDocument = srcDoc;

// select the layer to replace the image
app.activeDocument.activeLayer = imageLeft;

// paste the image
app.activeDocument.paste();



// for(var i = 0; i < fileList.length; i++) {
//
//     // load the images one by one
//     var doc = open(fileList[i])
//
//     // select all
//     activeDocument.selection.selectAll();
//
//     // copy image
//     activeDocument.selection.copy();
//
//     // close image without saving because thug life
//     app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
//
//     // select the source image
//     activeDocument = srcDoc;
//
//
//
//     }
//
// alert(fileList);
