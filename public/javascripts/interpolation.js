/**
 * @author masiar
 */

 var issues = [];
 var LUT = [];
 var squareTable = [];
 var generalCanvasHeight = parseInt(document.getElementById('newCanvas').getAttribute("height"));
 var generalCanvasWidth = parseInt(document.getElementById('newCanvas').getAttribute("width"));
 var greatestDistance = Math.round(Math.sqrt(generalCanvasWidth*generalCanvasWidth + generalCanvasHeight*generalCanvasHeight));
 var position = findPos(document.getElementById('infovis'));
 var imageArray = [];
 var colorTable = [];
 var firstTime = true;
 var gaussParameter = -0.001;
 
 startHeatMap();
 /**
 * Function to start all the basic functions for the heatmap.
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
    //alert(colorTable[i]);
  }
 }
 
 //Gaussian function
 /**
 * Gaussian function.
 */
function gauss(x){
  return Math.exp(gaussParameter*x*x);
}
 
 //Create square table
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
 
//Create LUT
/**
 * Function that creates the lookup table that will contain all the gaussian values. (MAYBE Not used anymore)
 */
function createLUT(){
  var infovisElement = document.getElementById('infovis');
  //alert("asd");
  var otherEnd = new Array(); 
  
  //Need to be changed with something like elem.style.width / height
  otherEnd[0] = position[0] + 800;
  otherEnd[1] = position[1] + 600;
  
  for(var i = 0; i < greatestDistance; i++){
    LUT[i] = gauss(i);
    //alert(LUT[i]);
  }
}

//Getting the # of Alternatives of an Issue
/**
 * Gets the gaussian value of a issue node.
 */
function getIssueValue(nodeId){
  for(var i = 0; i < nodeValue.length; i++){
    if(nodeValue[i].id == nodeId){
      return nodeValue[i].value;
    }
  }
  //No id match
  return null;
}

//Normalize the value computed
/**
 * Computes the normalization sum used when computing the heatmap.
 */
function normalizationSum(){
  /*var sum = 0;
  for(var i = 0; i < nodeValue.length; i++)
    sum += nodeValue[i].value;
  return sum;*/
  var max = 0;
  for(var i = 0; i < nodeValue.length; i++)
    if(nodeValue[i].value > max)
      max = nodeValue[i].value;
    
  return max;
}

//Find the value of the issue node into the nodeValue array
/**
 * Finds the value of the issue node in that particular moment.
 */
function findNodeValue(nodeId){
  for(var i = 0; i < nodeValue.length; i++){
    if(nodeValue[i].id === nodeId){
        //alert(nodeValue[i].value + " id: "+nodeValue[i].id);
       return nodeValue[i].value;
      }
  }
  return 0;
}

function findNodePosition(nodeId){
  for(var i = 0; i < nodeValue.length; i++){
    if(nodeValue[i].id === nodeId){
      return nodeValue[i].position;
    }
  }
  //alert("no position found!");
  return undefined;
}


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
var issuesValueForTest = [];
var deltaValue = 4;
var beta = deltaValue / 2;
var lastMetric, lastColor;
var metricToColors = {
  'red': undefined,
  'green': undefined,
  'blue': undefined
}
//Creates the heat map each time the graph is redrawn
/**
 * Big function that computes and draws the map. 
 */
function createMap(metric, color, slider){
  //alert(metric+" "+color)
  lastMetric = metric;
  lastColor = color;
  metricToColors[color] = metric;
  
  if(metric === "nothing"){
    drawMapNothing(color);
  }
  else{
    //alert(document.getElementById('infovis-canvas'));
  position = findPos(document.getElementById('infovis-canvas'));
  //Get all the issue nodes (and fill the array)
  issues = [];
  var indexPos = 0;
  var indexId = 0;
  /////////////////////////
  for(var i in overgraph.graph.nodes) {
    //if(overgraph.graph.nodes[i].data.typology === "Issue"){
      var el = document.getElementById(overgraph.graph.nodes[i].id);
      issuesId[indexId] = overgraph.graph.nodes[i].id;
      indexId++;
      //alert(el);
      issuesPosition[indexPos] = findPos(el);
      indexPos++;
      //alert(findPos(el) + " for id: " + overgraph.graph.nodes[i].id);
      
    //}
  }
  //drawMap();
  //alert(squareTable.length);
  //getMetric(issuesId, issuesPosition, metric, color);
  jQuery.getJSON("../metrics/" + metric + "?nodes=["+issuesId+"]", function(data) {
   for(var i = 0; i < issuesId.length; i++){
     addNodeValue(issuesId[i], data[issuesId[i]], issuesPosition[i]);
  }
  
  drawMap(color, slider);
  });
  }
}

function drawMapNothing(choosenColor){
  var canvasElement = document.getElementById('newCanvas');
   width = parseInt(canvasElement.getAttribute("width"));
      height = parseInt(canvasElement.getAttribute("height"));
    for(var i = 0; i < height; i = i + deltaValue){
      for(j = 0; j < width; j = j + deltaValue){
      //color = Math.floor(valueLookUpTable[Math.floor(colorMap_red[i*width + j])]);
      //if(imgd.data[index+0] > 0) alert(imgd.data[index+0]);
      //if(color != 0){
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
        //if(choosenColor === 'red'){
         // alert("" + Math.floor(valueLookUpTable[Math.floor(colorMap_red[i*width + j])]) +", "+Math.floor(valueLookUpTable[Math.floor(colorMap_green[i*width + j])]);+", "+Math.floor(valueLookUpTable[Math.floor(colorMap_blue[i*width + j])]));
          context.fillStyle = "rgba("+ color_red +", "+color_green+", "+color_blue+", 1)";
        //}
       context.fillRect (j - beta, i - beta, deltaValue + 2*beta, deltaValue + 2*beta); 
      //}
    }
  }
}


/**
 * drawMap() is a method that was created to dispatch the real drawings. It is simply divided from 
 * createMap() because it has to be called once the metrics are retrieved from the server.
 */
 var colorMap_red = [];
 var colorMap_green = [];
 var colorMap_blue = [];
 
 var valueLookUpTable_red = [];
 var valueLookUpTable_green = [];
 var valueLookUpTable_blue = [];
 
 var newColorMap = [];
 var newColorMapIndex = 0;
function drawMap(choosenColor, slider){
  //alert(nodeValue.length);
 /* for(var i = 0; i < nodeValue.length; i++){
    alert("id: " + nodeValue[i].id + ", value: "+ nodeValue[i].value + ", position: " + nodeValue[i].position);
  } */
  /////////////
  newColorMapIndex = 0;
  
  normSum = normalizationSum();
  for(var i in overgraph.graph.nodes) {
    //if(overgraph.graph.nodes[i].data.typology === "Issue"){
      var ele = document.getElementById(overgraph.graph.nodes[i].id);
      
     /* issuesId.push(overgraph.graph.nodes[i].id);
      issuesPosition.push(findPos(el));*/
      
      //alert("position: " + findPos(ele) + "for id = "+overgraph.graph.nodes[i].id);
      issues.push({
        //postion: array [x, y]
        position: findNodePosition(overgraph.graph.nodes[i].id),
        //id: int
        id: overgraph.graph.nodes[i].id,
        //value: int
        value: findNodeValue(overgraph.graph.nodes[i].id),
      });
      //alert(findNodeValue(overgraph.graph.nodes[i].id));
      for(var j = 0; j < nodeValue.length; j++){
        if(nodeValue[j].id == overgraph.graph.nodes[i].id){
          nodeValue[j].pos = findPos(ele);
        }
      }
    //} 
  }
  ////////////
  
  //alert("Issues in issues array with all the things.");
  /*for(var i = 0; i < issues.length; i++){
    alert("id: "+issues[i].id + ", postion: "+ issues[i].position + ", value: "+issues[i].value);
  } */
  //For each pixel then do something
  // Get a reference to the element.
  var canvasElement = document.getElementById('newCanvas');
  //alert(canvasElement);
  context = canvasElement.getContext('2d');
  
  // Create an ImageData object.
  // read the width and height of the canvas
  
  if(popUpVariable){
    width = document.getElementById('newCanvas').offsetWidth;
    height = document.getElementById('newCanvas').offsetHeight;
    //alert(width);
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
  //Loop for each pixel and compute the value
  //alert(height * 1/denominator);
  var maximum = 0;
  for (i = 0; i < height; i = i+deltaValue/*(1*denominator)*/) {
    for (j = 0; j < width; j = j+deltaValue) {
      
      /*colorValue = computeColorValue(j, i);*/
    
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
      //alert(thisNode[0] * 1/denominator);
      deltaX = Math.floor(pixel[0] * 1/denominator) - Math.floor(thisNode[0] * 1/denominator);
      //alert(deltaX);
      if(deltaX < 0)
        deltaX = -deltaX;
        
      //alert("pixel[0]: "+ pixel[0] * 1/denominator + " pixel[1] " + pixel[1] * 1/denominator) 
      deltaY = Math.floor(pixel[1] * 1/denominator) - Math.floor(thisNode[1] * 1/denominator);
      //alert(pixel[1]);
      if(deltaY < 0)
        deltaY = -deltaY;
      //alert(squareTable[deltaY] + squareTable[deltaY]);
      squaredValue = squareTable[deltaX] + squareTable[deltaY];
      //alert(squaredValue);
      if (squaredValue > (9800 * 5) * 1/denominator) {
        finalResult = 0;
        result += issues[k].value * finalResult;
        continue;
      }
      //alert(squaredResult);
      
      if (squaredValue == 0) {
        //alert("255 for pixel " + pixel);
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
      //alert(distance);
      //alert("inside: distance = " + distance +" pixel = "+ pixel[0] + " " + pixel[1] + " node = " + thisNode[0] + " " + thisNode[1] + " squaredValue");
      finalResult =  colorTable[distance];
      //if(distance < 40) alert(distance);
      result += issues[k].value * finalResult;
      //if(result > 0) alert(result);
      
      //Testing stuff
      /*
      issuesValueForTest.push("current iteration = " +k)
      issuesValueForTest.push("squaredValue = " +squaredValue);
      issuesValueForTest.push("distance = " +distance);
      issuesValueForTest.push("final result = " +finalResult);
      issuesValueForTest.push("colorTable[result] = " +colorTable[distance]);
      issuesValueForTest.push("issues[k].value = " + issues[k].value);
      issuesValueForTest.push("issues[k].value*colorTable[result] = " +issues[k].value*colorTable[distance])
      issuesValueForTest.push("result now = " +result);
      */
    }
    //result = result / normSum;
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
    newColorMap[newColorMapIndex] = result;
    newColorMapIndex++;
    /*if(result > 200){
      alert(issuesValueForTest + " THIS IS AFTER: result = " + result + " with normSum = " + normSum);
    }*/
    issuesValueForTest = [];
    colorValue =  result;
      
      
      
       
  /*    index = (j + i * imgd.width) * 4;
        imgd.data[index+0] = colorValue;
        imgd.data[index+1] = 0;
        imgd.data[index+2] = 0;
        imgd.data[index+3] = 0xff; */
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
  /*for(var i = 0; i < height; i = i+deltaValue){
    for(j = 0; j < width; j = j+deltaValue){
      index = (j + i * imgd.width) * 4;
        imgd.data[index+0] = valueLookUpTable[Math.floor(colorMap[i*width + j])];
        imgd.data[index+1] = 0;
        imgd.data[index+2] = 0;
        imgd.data[index+3] = 0xff;
    }
  }*/
  
  /*for(var i = 0; i < height / deltaValue; i++){
    for(j = 0; j < width / deltaValue; j++){
      index = (j + i * imgd.width) * 4;
        imgd.data[index+0] = valueLookUpTable[Math.floor(newColorMap[i*width/deltaValue + j])];
        imgd.data[index+1] = 0;
        imgd.data[index+2] = 0;
        imgd.data[index+3] = 0xff;
    }
  } 
  context.scale(0.7, 0.7);  */
  var m = 0, n = 0, color_red, color_blue, color_green ,index;
  //context.fillStyle = "rgb(0, 0, 0)";
  //context.fillRect(0, 0, width, height);
  fillMap(choosenColor, slider);
  //jQuery('#metricsPicker').hide().show();
  //context.putImageData(imgd, 0, 0);
  
}

/**
 * fillMap fills the map coloring the small squares using the deltaValue as w/h.
 */
 function fillMap(choosenColor, slider){
  var canvasElement = document.getElementById('newCanvas');
  context = canvasElement.getContext('2d');
  width = parseInt(canvasElement.getAttribute("width"));
  height = parseInt(canvasElement.getAttribute("height"));
  var m = 0, n = 0, color_red, color_blue, color_green ,index;
  //context.fillStyle = "rgb(0, 0, 0)";
  //context.fillRect(0, 0, width, height);
  for(var i = 0; i < height; i = i + deltaValue){
    for(j = 0; j < width; j = j + deltaValue){
      //color = Math.floor(valueLookUpTable[Math.floor(colorMap_red[i*width + j])]);
      //if(imgd.data[index+0] > 0) alert(imgd.data[index+0]);
      //if(color != 0){
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
        //if(choosenColor === 'red'){
         // alert("" + Math.floor(valueLookUpTable[Math.floor(colorMap_red[i*width + j])]) +", "+Math.floor(valueLookUpTable[Math.floor(colorMap_green[i*width + j])]);+", "+Math.floor(valueLookUpTable[Math.floor(colorMap_blue[i*width + j])]));
          context.fillStyle = "rgba("+ color_red +", "+color_green+", "+color_blue+", 1)";
        //}
       context.fillRect (j - beta, i - beta, deltaValue + 2*beta, deltaValue + 2*beta); 
      //}
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

//Compute the value of the color in the heatmap
/**
 * Computes the color value of a particular pixel. Now implemented in createMap().
 */
function computeColorValue(x, y){
  
  x = x + position[0] - 12;
  y = y + position[1] - 12;
  pixel = [x, y];
  result = 0;
  
  for(var k = 0; k < nodeValue.length; k++){
    thisNode = nodeValue[k].position;
  
    /*result += issues[k].value * gaussianFunction(pixel, thisNode);*/
    
    
    
    if (thisNode == undefined) {
      finalResult = 0;
      result += issues[k].value * finalResult;
      continue;
    }
    
    flag = true;
    deltaX = pixel[0] - thisNode[0];
    
    if(deltaX < 0)
      deltaX = -deltaX;
      
      
    deltaY = pixel[1] - thisNode[1];
    if(deltaY < 0)
      deltaY = -deltaY;
      
    squaredValue = squareTable[deltaX] + squareTable[deltaY];
    if (squaredValue > 9800 * 5) {
      finalResult = 0;
      result += issues[k].value * finalResult;
      continue;
    }
    //alert(squaredResult);
    
    if (squaredValue == 0) {
      finalResult = 255;
      result += issues[k].value * finalResult;
      continue;
    }
      
    half = Math.round(squareTable.length / 2);
    start = 0;
    end = squareTable.length;
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
    //alert("inside: distance = " + distance +" pixel = "+ pixel[0] + " " + pixel[1] + " node = " + thisNode[0] + " " + thisNode[1] + " squaredValue");
    finalResult =  colorTable[distance];
    result += issues[k].value * finalResult;
    
  }
  
  result = result / normSum;
  return result;    
}

//Compute the value of the function
/**
 * Computes the gaussian value of a pixel. Implemented in createMap().
 */
function gaussianFunction(pixel, node){
  if (node == undefined) {
    return 0;
  }
  
  flag = true;
  deltaX = pixel[0] - node[0];
  
  if(deltaX < 0)
    deltaX = -deltaX;
    
    
  deltaY = pixel[1] - node[1];
  if(deltaY < 0)
    deltaY = -deltaY;
    
  squaredValue = squareTable[deltaX] + squareTable[deltaY];
  if(squaredValue > 9800*5)
    return 0;
  //alert(squaredResult);
  
  if(squaredValue == 0)
    return 255;
    
  half = Math.round(squareTable.length / 2);
  start = 0;
  end = squareTable.length;
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
  //alert("distance outside = " + distance);
  
  return colorTable[distance];
}

var half
//Binary search to squareTable to speed up computations
/**
 * Binary search to speed up square root computations.
 */
function binarySearch(squaredValue){
  if(squaredValue == 0)
    return 0;
    
  half = Math.round(squareTable.length / 2);
  //var i = 0;
  while(true){
    if (squareTable[half] > squaredValue) {
      if(squareTable[half] >= squaredValue >= squareTable[half+1]){
        return half;
      }
      else
        half = Math.round(half / 2);
    }
    else if (squareTable[half] < squaredValue) {
        if(squareTable[half] <= squaredValue <= squareTable[half+1])
          return half;
        else
          half = Math.round(half / 2) + half;
      }
      else{
        return half;
      }
  }
}

//Set the pixel values
/**
 * Sets the color value of a particular pixel.
 */
function setPixel(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}

//Turn all black
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
 * Handler for the text area containing the gauss parameter
 */
 function gaussParameterHandler(){
    var newValue = document.gauss.gaussValue.value;
    if(newValue != ""){
      gaussParameter = parseFloat(newValue);
    }
    startHeatMap();
    createMap(lastMetric, lastColor, true);
 }
