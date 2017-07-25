var originalUnit = preferences.rulerUnits;
preferences.rulerUnits = Units.INCHES;

// Create a new 2x4 inch document and assign to var
var docRef = app.documents.add(2,4);

// Create a new art layer containing text
var artLayerRef = docRef.artLayers.add();
artLayerRef.kind = LayerKind.TEXT;

// Set the contents of the text layer
var textItemRef = artLayerRef.textItem;
textItemRef.contents = "I hate Tay"

// Release references
docRef = null
artLayerRef = null
textItemRef = null

// Restore original ruler unit setting
app.preferences.rulerUnits = originalUnit
