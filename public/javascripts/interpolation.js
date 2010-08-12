
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
 
 startHeatMap();
 /**
 * Function to start all the basic functions for the heatmap.
 */
 function startHeatMap(){
 	createSquareTable();
 	createLUT();
	createColorTable();
	//createMap();
	
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
	//var a, b, c;
	return Math.exp(-0.0001*x*x);
	//return Math.exp(a*x*x + b*x + c);
	//return (1 / Math.sqrt(2*Math.PI)) * Math.exp((-1/2)*Math.pow(x, 2));
	//return a*Math.exp(-((x - b)*(x-b)) / (2*c*c))
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
  alert("no position found!");
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
//Creates the heat map each time the graph is redrawn
/**
 * Big function that computes and draws the map. 
 */
function createMap(){
	position = findPos(document.getElementById('mycanvas-canvas'));
	//Get all the issue nodes (and fill the array)
	issues = [];
	/////////////////////////
	for(var i in overgraph.graph.nodes) {
    if(overgraph.graph.nodes[i].data.typology == "Issue"){
      var el = document.getElementById(overgraph.graph.nodes[i].id);
      
      issuesId.push(overgraph.graph.nodes[i].id);
      issuesPosition.push(findPos(el));
      //alert(findPos(el) + " for id: " + overgraph.graph.nodes[i].id);
      
    }
  }
  //drawMap();
  //alert(squareTable.length);
  getMetric(issuesId, issuesPosition);
  /////////////////////////
	/*for(var i in overgraph.graph.nodes) {
 		if(overgraph.graph.nodes[i].data.typology == "Issue"){
 		  var el = document.getElementById(overgraph.graph.nodes[i].id);
 		  
 		 /* issuesId.push(overgraph.graph.nodes[i].id);
 		  issuesPosition.push(findPos(el));
			
			issues.push({
				//postion: array [x, y]
				position: findPos(el),
				//id: int
				id: overgraph.graph.nodes[i].id,
				//value: int
				value: findNodeValue(overgraph.graph.nodes[i].id),
			});
			for(var j = 0; j < nodeValue.length; j++){
				if(nodeValue[j].id == overgraph.graph.nodes[i].id){
					nodeValue[j].pos = findPos(el);
				}
			}
		} 
	}*/
	//getMetric(issuesId, issuesPosition);
	//setTimeout('drawMap()', 100);
}

/**
 * drawMap() is a method that was created to dispatch the real drawings. It is simply divided from 
 * createMap() because it has to be called once the metrics are retrieved from the server.
 */
 var colorMap = [];
 var newColorMap = [];
 var newColorMapIndex = 0;
function drawMap(){
  /*
  for(var i = 0; i < nodeValue.length; i++){
    alert("id: " + nodeValue[i].id + ", value: "+ nodeValue[i].value + ", position: " + nodeValue[i].position);
  } */
  /////////////
  newColorMapIndex = 0;
  
  normSum = normalizationSum();
  for(var i in overgraph.graph.nodes) {
    if(overgraph.graph.nodes[i].data.typology === "Issue"){
      var ele = document.getElementById(overgraph.graph.nodes[i].id);
      
     /* issuesId.push(overgraph.graph.nodes[i].id);
      issuesPosition.push(findPos(el));*/
      if(findPos(ele)[0] === 0){
        //alert("position 0,0  id = : " + overgraph.graph.nodes[i].id);
      }
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
    } 
  }
  
  //Change css of the elements
  changecss('.ui-tabs', 'display', 'position: relative; padding: .2em; zoom: 1; none !important');
  changecss('.ui-tabs-hide', 'display', 'none !important');
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
	
	imgd = context.createImageData(width, height);
	var i,j;
	var issueLength = issues.length;
	var squareTableLength = squareTable.length;
	//Loop for each pixel and compute the value
	//alert(height * 1/denominator);
	var maximum = 0;
	for (i = 0; i < height; i = i+deltaValue/*(1*denominator)*/) {
		for (j = 0; j < width; j = j+deltaValue) {
		  
			/*colorValue = computeColorValue(j, i);*/
		
		pixel = [j + position[0] - 35, i + position[1] - 15];
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
		colorMap[i*width + j] = result;
		newColorMap[newColorMapIndex] = result;
		newColorMapIndex++;
    /*if(result > 200){
      alert(issuesValueForTest + " THIS IS AFTER: result = " + result + " with normSum = " + normSum);
    }*/
    issuesValueForTest = [];
		colorValue =  result;
			
			
			
			 
	/*		index = (j + i * imgd.width) * 4;
  			imgd.data[index+0] = colorValue;
    		imgd.data[index+1] = 0;
    		imgd.data[index+2] = 0;
    		imgd.data[index+3] = 0xff; */
		} 
	}
	var valueLookUpTable = [];
	for(var i = 0; i < maximum; i++){
	  valueLookUpTable[i] = i * 255 / maximum;
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
	var m = 0, n = 0, color;
	context.fillStyle = "rgb(0, 0, 0)";
	context.fillRect(0, 0, width, height);
	for(var i = 0; i < height; i = i + deltaValue){
	  for(j = 0; j < width; j = j + deltaValue){
	    color = Math.floor(valueLookUpTable[Math.floor(colorMap[i*width + j])]);
	    if(color != 0){
	     context.fillStyle = "rgba("+ color +", 0, 0, 0.9)";
	     context.fillRect (j - beta, i - beta, deltaValue + 2*beta, deltaValue + 2*beta); 
	     //context.arc(j, i, deltaValue, 0, Math.PI*2, true);
	    }
	   /* for(m = i; m < i + deltaValue; m++){
	      for(n = j; n < j + deltaValue; n++){
	        index = (n + m * imgd.width) * 4;
          imgd.data[index+0] = valueLookUpTable[Math.floor(colorMap[i*width + j])];
          imgd.data[index+1] = 0;
          imgd.data[index+2] = 0;
          imgd.data[index+3] = 0xff;
	      }
	    } */
	  }
	}
	context.fill();
	//context.putImageData(imgd, 0, 0);
	
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
   			imgd.data[index+0] = 0;
    		imgd.data[index+1] = 0;
   			imgd.data[index+2] = 0;
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

//Some random text to be deleted soon
	/*context.fillStyle   = '#00f'; // blue
context.strokeStyle = '#f00'; // red
context.lineWidth   = 4;

// Draw some rectangles.
context.fillRect  (0,   0, 150, 50);
context.strokeRect(0,  60, 150, 50);
context.clearRect (30, 25,  90, 60);
context.strokeRect(30, 25,  90, 60); */

