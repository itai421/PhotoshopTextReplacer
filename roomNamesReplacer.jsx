//the names of the layers: names0,name1,names2.... and roomNumber

//------------------   includes  ----------------
#include "jamJSON.jsxinc";
//----------------------------------------------

//------------------   consts   ----------------
const DataFilePath = "\\data.json";
const OutputPath = "\\output\\";
const TemplateNamePrefix = "roomWithCapacity_"; //for example roomWithCapacity_6.psd
const TemplatePath = "\\Templates\\";
//----------------------------------------------

//------------------  funcs   -----------------
function setUnitsToPixels () {
if (app.preferences.rulerUnits != Units.PIXELS){
		app.preferences.rulerUnits = Units.PIXELS;
	}
}

function replaceText(text, layerName, docRef){
	var name1 = docRef.artLayers.getByName(layerName);
	name1.textItem.contents = text;
	name1.name = layerName;
}

function saveForWeb(saveFile) {  
	if(saveFile.exists){  
		saveFile.remove();  
    }  
	var options = new ExportOptionsSaveForWeb();
	options.format = SaveDocumentType.PNG;
	options.PNG8 = false;
	options.transparency = true;
	options.optimized = true;
	docRef.exportDocument(saveFile, ExportType.SAVEFORWEB, options);  
}

function readFile(path){
	var dataFile = new File(path);
	dataFile.open('r');
	var str = "";
	while(!dataFile.eof)
	str += dataFile.readln();
	dataFile.close();
	return str;
}

function getRoomCapacity(room){
	return room.names.length;
}

function getTemplateName (capacity){
	return TemplateNamePrefix + capacity;
}

function openTemplate (name){
	var fileRef = new File(TemplatePath + name + ".psd");
	return app.open (fileRef);
}

function replaceAllNames(names, docRef){
	for (var j=0;j<names.length;j++){
		replaceText(names[j],"name" + j,docRef)
	}
}
//---------------------------------------------

setUnitsToPixels();

var fileData = readFile(DataFilePath)
var rooms = jamJSON.parse(fileData);

for (var i=0;i<rooms.length;i++){
	var room = rooms[i];
	var	roomCapacity = getRoomCapacity(room);
	var	templateName = getTemplateName(roomCapacity);
	
	var docRef = openTemplate(templateName);
	setUnitsToPixels();
	
	replaceText(room.roomNumber,"roomNumber",docRef);
	replaceAllNames(room.names,docRef);
	
	var saveFile = File(OutputPath + room.roomNumber +'.png');
	saveForWeb(saveFile); 
}