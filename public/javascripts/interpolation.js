/**
 * @author Masiar Babazadeh
 */


	var issues = [];
	 var LUT = [];
	 var squareTable = [];
	 var generalCanvasHeight; //= parseInt(document.getElementById('newCanvas').getAttribute("height"));
	 var generalCanvasWidth; //= parseInt(document.getElementById('newCanvas').getAttribute("width"));
	 var greatestDistance; //= Math.round(Math.sqrt(generalCanvasWidth*generalCanvasWidth + generalCanvasHeight*generalCanvasHeight));
	 var position;  //= findPos(document.getElementById('infovis'));
	 var imageArray = [];
	 var colorTable = [];
	 var firstTime = true;
	 var gaussParameter = -0.001;
	 var colorValue;
	  var imgd;
	  var context;
	  var deltaX;
	  var deltaY;
	  var squaredValue;
	  var distance;
	  var flag;
	  var end;
	  var start;
	  var thisNode;
	  var issueValue;
	  var result;
	  var pixel;
	  var normSum;
	  var finalResult;
	  var denominator = 1;
	  var issuesId = [];
	  var issuesPosition = [];
	  var deltaValue = 4;
	  var beta = deltaValue / 2;
	  var lastMetric, lastColor;
	  var metricToColors = {
	    'red': undefined,
	    'green': undefined,
	    'blue': undefined
	  }

function postRenderInit() {
 	 /******************************************************************/
	 generalCanvasHeight = parseInt(document.getElementById('newCanvas').getAttribute("height"));
	 generalCanvasWidth = parseInt(document.getElementById('newCanvas').getAttribute("width"));
	 greatestDistance = Math.round(Math.sqrt(generalCanvasWidth*generalCanvasWidth + generalCanvasHeight*generalCanvasHeight));
	 position = findPos(document.getElementById('infovis'));
	 InitUI();
	 /******************************************************************/

}
 
 /**
 * Function to start all the basic functions for the heatmap and fills the basic arrays used to compute it.
 */
 function startHeatMap(){
  createSquareTable();
  createLUT();
  createColorTable();
  
  //Create the 2D array 
  for(var i = 0; i < generalCanvasWidth; i++){
    imageArray[i] = [];
  }
 }
 
 /**
 * Creates the color table that will contain all the color values following a gaussian curve.
 */
 function createColorTable(){
  for(var i = 0; i < 500; i++){
    colorTable[i] = gauss(i)*255;
  }
 }
 
 /**
 * Gaussian function.
 */
function gauss(x){
  return Math.exp(gaussParameter*x*x);
}

 /**
 * Function that creates the table of squares used to speed up computations.
 */
 function createSquareTable(){
    var width = generalCanvasWidth;
    var height = generalCanvasHeight;
  greatestDistance = Math.round(Math.sqrt(generalCanvasWidth*generalCanvasWidth + generalCanvasHeight*generalCanvasHeight));
  for(var i = 0; i < greatestDistance; i++)
    squareTable[i] = Math.pow(i, 2);
 }

/**
 * Function that creates the lookup table that will contain all the gaussian values. (MAYBE Not used anymore)
 */
function createLUT(){
  var infovisElement = document.getElementById('infovis');
  var otherEnd = new Array(); 
  
  //Need to be changed with something like elem.style.width / height
  otherEnd[0] = position[0] + 800;
  otherEnd[1] = position[1] + 600;
  
  for(var i = 0; i < greatestDistance; i++){
    LUT[i] = gauss(i);
  }
}

/**
 * Computes the normalization sum used when computing the heatmap.
 */
function normalizationSum(){
  var max = 0;
  for(var i = 0; i < nodeValue.length; i++)
    if(nodeValue[i].value > max)
      max = nodeValue[i].value;
    
  return max;
}

/**
 * Finds the value of the issue node in that particular moment.
 */
function findNodeValue(nodeId){
  for(var i = 0; i < nodeValue.length; i++){
    if(nodeValue[i].id === nodeId){
       return nodeValue[i].value;
      }
  }
  return 0;
}

/**
 * Finds the position of the node given an ID. The function searches the position into the nodeValue array.
 * @param {int} The integer representing the ID of the node.
 */
function findNodePosition(nodeId){
  for(var i = 0; i < nodeValue.length; i++){
    if(nodeValue[i].id === nodeId){
      return nodeValue[i].position;
    }
  }
  return undefined;
}

/**
 * Function that creates the basis to draw the map. It needs a metric, a color and a boolean that tells if the
 * call of the function comes from one of the sliders.
 * @param {String} The choosen metric to be represented.
 * @param {String} The choosen color to draw the map.
 * @param {boolean} A boolean that tells that the function call comes from one of the sliders.
 */
function createMap(metric, color, slider){
  lastMetric = metric;
  lastColor = color;
  metricToColors[color] = metric;
  
  if( !metric || metric === "nothing"){
    drawMapNothing(color);
  }
  else{
  position = findPos(document.getElementById('infovis-canvas'));
  
  //Get all the issue nodes (and fill the array)
  issues = [];
  var indexPos = 0;
  var indexId = 0;
  for(var i in overgraph.graph.nodes) {
      var el = document.getElementById(overgraph.graph.nodes[i].id);
      issuesId[indexId] = overgraph.graph.nodes[i].id;
      indexId++;
      issuesPosition[indexPos] = findPos(el);
      indexPos++;
  }
  jQuery.getJSON("/metrics/" + metric + "?nodes=["+issuesId+"]", function(data) {
   for(var i = 0; i < issuesId.length; i++){
     addNodeValue(issuesId[i], data[issuesId[i]], issuesPosition[i]);
  }
  
  drawMap(color, slider);
  });
  }
}

/**
 * This function takes as parameter the color that must be deleted from the map.
 * Its work is to remove the map with the choosen color.
 * @param {String} The choosen color to be removed from the map.
 */
function drawMapNothing(choosenColor){
  var canvasElement = document.getElementById('newCanvas');
   width = parseInt(canvasElement.getAttribute("width"));
      height = parseInt(canvasElement.getAttribute("height"));
    for(var i = 0; i < height; i = i + deltaValue){
      for(j = 0; j < width; j = j + deltaValue){
        color_red = Math.floor(valueLookUpTable_red[Math.floor(colorMap_red[i*width + j])]);
        if(isNaN(color_red)){
            color_red = 0;
        } 
        if(choosenColor === 'red'){
          color_red = 0;
          colorMap_red[i*width + j] = 0;
        }
        
        color_green = Math.floor(valueLookUpTable_green[Math.floor(colorMap_green[i*width + j])]);
        if(isNaN(color_green)){
            color_green = 0;
        }
        if(choosenColor === 'green'){
          color_green = 0;
          colorMap_green[i*width + j] = 0;
        }
        
        color_blue = Math.floor(valueLookUpTable_blue[Math.floor(colorMap_blue[i*width + j])]);
        if(isNaN(color_blue)){
            color_blue = 0;
        }
        if(choosenColor === 'blue'){
          color_blue = 0;
          colorMap_blue[i*width + j] = 0;
        }
          
        index = (j + i * imgd.width) * 4;
        context.fillStyle = "rgba("+ color_red +", "+color_green+", "+color_blue+", 1)";
        context.fillRect (j - beta, i - beta, deltaValue + 2*beta, deltaValue + 2*beta);
    }
  }
}

 var colorMap_red = [];
 var colorMap_green = [];
 var colorMap_blue = [];
 var valueLookUpTable_red = [];
 var valueLookUpTable_green = [];
 var valueLookUpTable_blue = [];
 
/**
 * This function gets directly called from createMap. Its work is to create the array of 
 * gaussian values to be represented in the map.
 * @param {String} The choosen color for the map.
 * @param {boolean} Boolean value that tells the function that the function call is from a slider.
 */
function drawMap(choosenColor, slider){
  normSum = normalizationSum();
  for(var i in overgraph.graph.nodes) {
      var ele = document.getElementById(overgraph.graph.nodes[i].id);
      
      issues.push({
        //postion: array [x, y]
        position: findNodePosition(overgraph.graph.nodes[i].id),
        //id: int
        id: overgraph.graph.nodes[i].id,
        //value: int
        value: findNodeValue(overgraph.graph.nodes[i].id),
      });
      for(var j = 0; j < nodeValue.length; j++){
        if(nodeValue[j].id == overgraph.graph.nodes[i].id){
          nodeValue[j].pos = findPos(ele);
        }
      }
  }
  
  // Get a reference to the element.
  var canvasElement = document.getElementById('newCanvas');
  context = canvasElement.getContext('2d');
  
  // Create an ImageData object.
  // read the width and height of the canvas
  if(popUpVariable){
    width = document.getElementById('newCanvas').offsetWidth;
    height = document.getElementById('newCanvas').offsetHeight;
  }
  
  else{
    width = parseInt(canvasElement.getAttribute("width"));
      height = parseInt(canvasElement.getAttribute("height"));
  }
  
  //ImageData check
  if(firstTime){
    imgd = context.createImageData(width, height);
    firstTime = false;
  }
  else{
    imgd = context.getImageData(0, 0, width, height);
  }
  
  var i,j;
  var issueLength = issues.length;
  var squareTableLength = squareTable.length;
  var maximum = 0;
  for (i = 0; i < height; i = i+deltaValue) {
    for (j = 0; j < width; j = j+deltaValue) {
    
    pixel = [j + position[0] - 24, i + position[1] - 12];
    result = 0;
    
    for(var k = 0; k < issueLength; k++){
      thisNode = issues[k].position;
            
      if (thisNode == undefined) {
        finalResult = 0;
        result += issues[k].value * finalResult;
        continue;
      }
      
      flag = true;
      deltaX = Math.floor(pixel[0] * 1/denominator) - Math.floor(thisNode[0] * 1/denominator);
      if(deltaX < 0)
        deltaX = -deltaX;
        
      deltaY = Math.floor(pixel[1] * 1/denominator) - Math.floor(thisNode[1] * 1/denominator);
      if(deltaY < 0)
        deltaY = -deltaY;
      squaredValue = squareTable[deltaX] + squareTable[deltaY];
      if (squaredValue > (9800 * 5) * 1/denominator) {
        finalResult = 0;
        result += issues[k].value * finalResult;
        continue;
      }
      
      if (squaredValue == 0) {
        finalResult = 255;
        result += issues[k].value * finalResult;
        continue;
      }
        
      half = Math.round(squareTableLength / 2);
      start = 0;
      end = squareTableLength;
      while(start + 1 != end){
        if(squareTable[half] > squaredValue){
          end = half;
        }
        else{
          start = half;
        }
        half = Math.round((end - start) / 2) + start;
      }
      distance = start;
      finalResult =  colorTable[distance];
      result += issues[k].value * finalResult;
    }
    if(result > maximum)
      maximum = result;
      
    if(choosenColor === 'red'){
      colorMap_red[i*width + j] = result; 
    }
    else if(choosenColor === 'green'){
      colorMap_green[i*width + j] = result;
    }
    else{
      colorMap_blue[i*width + j] = result;
    }
    colorValue =  result;
    } 
  }

  if(choosenColor === 'red'){
    for(var i = 0; i < maximum; i++){
      valueLookUpTable_red[i] = i * 255 / maximum;
    }
  }
  
  else if(choosenColor === 'green'){
    for(var i = 0; i < maximum; i++){
      valueLookUpTable_green[i] = i * 255 / maximum;
    }
  }
  
  else{
    for(var i = 0; i < maximum; i++){
      valueLookUpTable_blue[i] = i * 255 / maximum;
    }
  }
  
  var j = 0;
  var m = 0, n = 0, color_red, color_blue, color_green ,index;
  fillMap(choosenColor, slider);
  
}

/**
 * fillMap fills the map coloring the small squares using the deltaValue as w/h.
 * @param {String} The string that represent the choosen color to represent the current metric.
 * @param {boolean} A boolean value that tells the function if the call is from the slider, in which case it has to redaw also the other two colors.
 */
 function fillMap(choosenColor, slider){
  var canvasElement = document.getElementById('newCanvas');
  context = canvasElement.getContext('2d');
  width = parseInt(canvasElement.getAttribute("width"));
  height = parseInt(canvasElement.getAttribute("height"));
  var m = 0, n = 0, color_red, color_blue, color_green ,index;
  for(var i = 0; i < height; i = i + deltaValue){
    for(j = 0; j < width; j = j + deltaValue){
        color_red = Math.floor(valueLookUpTable_red[Math.floor(colorMap_red[i*width + j])]);
        if(isNaN(color_red)){
            color_red = 0;
        } 
        
        color_green = Math.floor(valueLookUpTable_green[Math.floor(colorMap_green[i*width + j])]);
        if(isNaN(color_green)){
            color_green = 0;
        }
        color_blue = Math.floor(valueLookUpTable_blue[Math.floor(colorMap_blue[i*width + j])]);
        if(isNaN(color_blue)){
            color_blue = 0;
        }
          
        
        index = (j + i * imgd.width) * 4;
          context.fillStyle = "rgba("+ color_red +", "+color_green+", "+color_blue+", 1)";
       context.fillRect (j - beta, i - beta, deltaValue + 2*beta, deltaValue + 2*beta); 
    }
  }
  
  if(firstTime)
    firstTime = false;
  
  context.fill();
  
  if(slider){
    if(choosenColor === 'red'){
      if(metricToColors['green'] != undefined)
        createMap(metricToColors['green'], 'green', false);
      if(metricToColors['blue'] != undefined)
        createMap(metricToColors['blue'], 'blue', false);
    }
    else if(choosenColor === 'green'){
      if(metricToColors['red'] != undefined)
        createMap(metricToColors['red'], 'red', false);
      if(metricToColors['blue'] != undefined)
        createMap(metricToColors['blue'], 'blue', false);
    }
    else{
      if(metricToColors['red'] != undefined)
        createMap(metricToColors['red'], 'red', false);
      if(metricToColors['green'] != undefined)
        createMap(metricToColors['green'], 'green', false);
    }
  }
 }

/**
 * Turns all the canvas to black. Used when resetting the tree.
 * @param {Object} Flag used to check if the function was called from the reset button.
 */
function turnBlack(flag){
  // Get a reference to the element.
  var canvasEl = document.getElementById('newCanvas');
  var context = canvasEl.getContext('2d');
  // Create an ImageData object.
  // read the width and height of the canvas
  var canvWidth = parseInt(canvasEl.getAttribute("width"));
  var canvHeight = parseInt(canvasEl.getAttribute("height"));
  var imgd = context.createImageData(canvWidth, canvHeight);
  var index = 0;
  for (var i = 0; i < canvHeight; i++) {
    for (var j = 0; j < canvWidth; j++) {
      index = (i + j * imgd.width) * 4;
        imgd.data[index+0] = 0; //r
        imgd.data[index+1] = 0; //g
        imgd.data[index+2] = 0; //b
        imgd.data[index+3] = 0xff;
    }
  }
  context.putImageData(imgd, 0, 0);
  
  //Keep the first element of nodeValue (the center)
  if (flag != null) {
    createMap();
  }
  else {
    var firstElement = nodeValue[0];
    nodeValue = [];
    nodeValue.push(firstElement);
    
    createMap();
  }
}

/**
 * Handler for the text area containing the gauss parameter.
 */
 function gaussParameterHandler(){
    var newValue = document.gauss.gaussValue.value;
    if(newValue != ""){
      gaussParameter = parseFloat(newValue);
    }
    startHeatMap();
    createMap(lastMetric, lastColor, true);
 }