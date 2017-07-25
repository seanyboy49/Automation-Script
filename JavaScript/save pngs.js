#target Photoshop

var doc = app.activeDocument;
var layer = doc.activeLayer;
var group = layer.parent.layers;

// saving as a png
function savePNG() {
  var pngOptions = new PNGSaveOptions(); // class for defining save output options
  if(group[0].name === " ") {
    var str = "";
  } else {
    var str = "-" + group[0].name;
  }
  var path = File(doc.path + "/" + layer.name + str + ".png");
  doc.saveAs(path, pngOptions, ture, Extensions.LOWERCASE)
}

function switchLayer(i) {
  layer.visible = false;
  doc.activeLayer = group[i];
  layer = doc.activeLayer;
  layer.visible = true;
}

for(var i=0; i < group.length; i++) {
  savePNG();
  if(i+1 >= group.length){
    break;
  }
  switchLayer(1)
}
