//Global useful variables
var thisID;
var jsons = [];
var index = 0;
var center = [];
var overgraph;
var removed_elements = [3];
removed_elements['Issue'] = [];
removed_elements['Alternative'] = [];
removed_elements['Tag'] = [];
var artifactTable;
var  TimeToFade = 500.0;
var clicked = false;
var whatIsChecked = [3];
var nodeValue =[];
var countAlternatives = 0;
var popUpVariable = false;


/**
 * Helper function to find a postion of an object in a page.
 * @param {HTMLObject} Object which we need to find the position.
 */
	function findPos(obj) {
		var curleft = curtop = 0;
		if (obj.offsetParent) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			}
			while (obj = obj.offsetParent);
		}
	return [curleft,curtop];
}

/**
 * Function to add an object that contains a node ID, a value and a position to the nodeValue array.
 * @param {int} ID of the node we want to add.
 */
function addNodeValue(nodeId, value, position){
  for(var i = 0; i<nodeValue.length; i++){
    if(nodeId === nodeValue[i].id){
       
       nodeValue[i].value = value;
       nodeValue[i].position = position;
       //alert("node already added: "+nodeId + " === " + nodeValue[i].id + ", refreshing it: position now: " +nodeValue[i].position);
       return; //refreshed the node
    }
  }
  
  value = value === undefined ? 0 : value; //check for the undefineteness of the value
  //if(nodeId === 69) alert("nodeId === 69: pos: " + position);
	nodeValue.push({id: nodeId, value: value, position: position});
	//alert(value);
	return true;
}

/**
 * Function to check the status of the checkboxes and remove nodes by concequence.
 */
function checkboxesStatus(){
	//alert("ciao");
	document.check.issue.checked = whatIsChecked[0];
	document.check.alternative.checked = whatIsChecked[1];
	document.check.tag.checked = whatIsChecked[2];
	
	if(!whatIsChecked[0])
		remove('Issue');
		
	if(!whatIsChecked[1])
		remove('Alternative');
		
	if(!whatIsChecked[2])
		remove('Tag');
}

var Log = {
    elem: false,
    write: function(text){
        if (!this.elem) 
            this.elem = document.getElementById('log');
        this.elem.innerHTML = text;
        this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
    }
};

/**
 * TODO I don't remember this one.
 */
function addEvent(obj, type, fn) {
    if (obj.addEventListener) obj.addEventListener(type, fn, false);
    else obj.attachEvent('on' + type, fn);
};

/**
 * Gets the JSON structure of the graph through an asynchronous request and calls the main function to plot it.
 * @param {String} url URL of the JSON structure.
 * @param {Function} callback Function to be called after the JSON is downloaded. 
 */
function getJSON(url, callback) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', url, true);
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 3) {
		
		}
		if (xmlhttp.readyState == 4) {
			callback(xmlhttp.responseText, false);
		}
	}
	xmlhttp.send(null);
}

/**
 * Gets the node's information table. It modifies dynamically the div containing the information of hovered nodes. As soon as
 * the user goes on mouse over the node, this function is called, it does an asynchronous request to the server and gets the information
 * needed. It's already on the HTML form. It also splits the table if the result is too long.
 * @param {String} url URL of the node's information. 
 */
function getHTML(url) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', url, true);
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 3) {
		
		}
		if (xmlhttp.readyState == 4) {
			var arr = xmlhttp.responseText.match(/<td>/ig);
			var splitted = xmlhttp.responseText.split('</td>');
			var finalsum = '';
			for(i = 0; i < arr.length; i++){
				if(splitted[i].length > 100){
					var subsplit = splitted[i].split('<td>');
					if(subsplit[1].length > 40){
						splitted[i] = subsplit[0] + '<td>' + subsplit[1].slice(0, 50) + '...';
					}
				//	splitted[i] = splitted[i].slice(0, 100);
				//	splitted[i] += '...';
				}
				finalsum += splitted[i];
			}
			document.getElementById('infonode').innerHTML = /*xmlhttp.responseText*/finalsum.replace("<table>", "<table class='infotable'>");
			fade('infonode');
		}
	}
	xmlhttp.send(null);
}

/**
 * Creates the view of the graph taking the div that contains the graph and working on it. It also works for the 
 * fullscreen visualization but the flag must be set to true.
 * @param {JSON} json JSON object that will be plotted by the graph.
 * @param {Boolean} pop_up Boolean flag used to check if the call came from the pop-up functionality or from the "normal" call as soon as the page loads.
 */
function callback(json, pop_up) {
	count = 0;
	var infovis = document.getElementById('infovis');
	var divPos = findPos(infovis);
    var w = infovis.offsetWidth - 50, h = infovis.offsetHeight - 50;
	//load JSON data.
	if(!pop_up)
		json = eval('(' + json + ')');
	
	//sets the global variables
	jsons[index] = json;
	index++;
	
	//var nodeFlag = addNodeValue(json.id);
	
    //init canvas
    //Create a new canvas instance.
    var canvas = new Canvas('mycanvas', {
        'injectInto': 'infovis',
        'width': w,
        'height': h
    });
	overCanvas = canvas;
    //end
    var style = document.getElementById('mycanvas').style;
    style.marginLeft = style.marginTop = "25px";
    //init Hypertree
    var rgraph = new RGraph(canvas, {
        //Change node and edge styles such as
        //color, width and dimensions.
        Node: { 
			'overridable': true, 
            dim: 0.1,
            color: '#fff',
			type:'star'
        },
        
        Edge: {
			'overridable': true,
            lineWidth: 4,
            color: '#00f'
        },
        
        onBeforeCompute: function(node){
            Log.write("centering" + node.name +"...");
        },
		
		onAfterCompute: function(){
            Log.write("done");
        },
        //Attach event handlers and add text to the
        //labels. This method is only triggered on label
        //creation
        onCreateLabel: function(domElement, node) {
			if (node.data.typology === "Issue") {
			  //alert(node.id);
				domElement.innerHTML = "<span onmouseover=\"fadeBox.showTooltip(event,'" + node.name + "')\">"+
				"<img src='../images/issue_cloud.png'></img></span>";
			}
			else 
				if (node.data.typology === "Alternative") {
					domElement.innerHTML = "<span onmouseover=\"fadeBox.showTooltip(event,'" + node.name + "')\">"+
					"<img src='../images/alternative_cloud.png'></img></span>";
				}
				else {
				  //node.id === 69 ? alert("nodeid = 69")
					domElement.innerHTML = "<span onmouseover=\"fadeBox.showTooltip(event,'" + node.name + "')\">"+
					"<img src='../images/tag.png'></img></span>";
				}
			//OnDlbClick centers the node
            domElement.ondblclick = function() {
				//turnBlack();
					rgraph.onClick(node.id, {
					onAfterCompute: function() {
						center.push(node.id);
						if(node.id != 208){
						  jQuery.getJSON("../relations/tree?id="+nodeID+"&degree="+1, function(data) {
						    //alert(data);
						    processJson(data, rgraph, json);
						  });
						}
							//getNewJson(node.id, rgraph, json);
						/*rgraph.op.sum(newjs, {
							type: 'fade:seq',  
							duration: 1000,  
							hideLabels: true,  
							transition: Trans.Quad.easeInOut
						});*/
						
					}
				});
			},
			//OnClick writes outside the name of the node and the "data" in it. to be refactored soon (previously onMouseOver)
			domElement.onclick = function(){
				fade('infonode');
				//document.getElementById('infonode').style.opacity = 0;
				var path = '../taggables/'+node.id;
				setTimeout("getHTML('../taggables/'+"+node.id+")", TimeToFade);
			}
			//OnMouseOver a box appears containing the node name
			domElement.onmouseover = function(){
				
			}
        },
        //Change node styles when labels are placed
        //or moved.
        onPlaceLabel: function(domElement, node){
			//Get the position of the node
			var nodePos = findPos(domElement);
			//draw(nodePos[0], nodePos[1]);
            var style = domElement.style;
            style.display = '';
            style.cursor = 'pointer';

            var left = parseInt(style.left);
            var w = domElement.offsetWidth;
            style.left = (left - w / 2) + 'px';
			
			divPos = findPos(document.getElementById('infovis'));
			//Check if the element is inside the visualization div, if not, don't paint it
			if(nodePos[1] < divPos[1] || nodePos[1] > divPos[1] + h || nodePos[0] < divPos[0] || nodePos[0] > divPos[0] + infovis.offsetWidth - 50){
				style.display = 'none';
			}
			
			//If popup (fullscreen vis) correct the label position
			if(pop_up){
				style.top = (parseInt(style.top) - 15) + 'px';
				popUpVariable = true;
			}
			
        },
        
        onBeforePlotLine: function(adj){
			var childNode = adj.nodeTo._depth >= adj.nodeFrom._depth? adj.nodeTo : adj.nodeFrom;
			adj.data.$color = childNode.data.relationColor; 
			
        },
		onAfterPlotLine: function(){
			
		}
    });
	//Putting the canvas to draw the heatmap
	//document.getElementById('mycanvas').innerHTML += "<canvas id=\"newCanvas\" width=\"1184\" height=\"550\" style=\"position: absolute; top: 0pt; left: 0pt; width: 1184px; height: 550px;\"></canvas>";
	
	json = modjson(json);
  rgraph.loadJSON(json);
	center.push(json.id);
	//center = json.id;
    //compute positions and plot.
    rgraph.refresh();
    //end
	//createLUT();
    rgraph.controller.onAfterCompute();
	if (pop_up) {
		computePopupVis(rgraph);
		checkboxesStatus();
		//rgraph.onClick(center[center.length - 1]);
	}	
		
	overgraph = rgraph;
	
	//TEST TO CREATE THE MAP
	createMap();
	

}

//Processes the new json adding it to the previous one with the sum operation
/**
 * This function checks the differences between the new JSON and the one the view is currently using. 
 * The main functionality is to process the new JSON structure received and checks which nodes should be removed (for now this
 * functionality is commented out since we don't want nodes to be removed yet) and which nodes are missing from the current view
 * that must be added (through the op.sum() method).
 * @param {JSON} json New JSON structure that must be processed.
 * @param {RGraph} rgraph The RGraph structure that represents the current graph.
 * @param {JSON} oldjson Old JSON structure that must be updated.
 */
function processJson(json, rgraph, oldjson, flag){
  //if(flag)
	 //json = eval( '('+ json +')')
	//If the node clicked is an issue, do the addNodeValue (since only issues will have the heatmap around)
	if (json.type == "Issue") {
		//var flag = addNodeValue(json.id);
		
	}
	jsons.push(json);
	var nodes = nodesToRemove(json, oldjson);
	json = modjson(json);
	
	//removes the elements looking at the checkboxes status
	json = removeElementsBeforeVis(json);
	rgraph.op.sum(json, {
		type: 'fade:seq',
		duration: 500,
		hideLabels: false,
		transition: Trans.Quad.easeInOut,
		onComplete: function(){
			createMap();
		}
	});
	
	overgraph = rgraph;
	
}

//Function that computes the nodes to remove (at distance 1)
/**
 * This functins gathers the nodes that have to be removed from the view (if they are at distance more than 1 step from the current center).
 * For now these nodes are not removed since we just keep them ad use the checkboxes to manage the view.
 * @param {JSON} newJson It's the new JSON structure just received.
 * @param {JSON} oldJson The old JSON structure used in the graph.
 */
function nodesToRemove(newJson, oldJson){
	var elementsToRemove = [];
	var x = 0;
		for(j = 0; j < oldJson.children.length; j++){
			if(oldJson.children[j].id != newJson.id){
				elementsToRemove[x] = oldJson.children[j].id;
				x++;
			}
		}
	return elementsToRemove;
}

//Gets the new json when clicking on a node
/**
 * Gets the new JSON structure as soon as a node is clicked. The new JSON is received through an asynchronous request to the server.
 * @param {Int} nodeID ID of the node that was clicked and is going to be centered.
 * @param {RGraph} rgraph RGraph object that represent the full graph.
 * @param {JSON} json Current JSON loaded by the graph.
 */
function getNewJson(nodeID, rgraph, json){
	var url = "../relations/tree?id="+nodeID;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', url, true);
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 3) {
			
		}
		if (xmlhttp.readyState == 4) {
			processJson(xmlhttp.responseText, rgraph, json);
		}
	}
	xmlhttp.send(null);
}

//init data as relation issue -> alternatives
/**
 * First method called that starts by getting the first JSON structure.
 * @param {Int} id ID of the center of the node.
 * @param {String} relation Type of the relation to get, currently not used.
 */
function init(id, relation){
	if (!clicked) {
		thisID = id;
		clicked = true;
		getJSON("../relations/tree?id=" + id /*+"&type="+relation*/, callback);
	}
}

// Helper functions for related functionalities
/**
 * Helper function that is called when the fullscreen button is clicked. It starts all the computations to have
 * the graph fullscreen.
 * @returns false
 */
function popup(){
 	params  = 'width='+screen.width;
 	params += ', height='+screen.height;
 	params += ', top=0, left=0'
 	params += ', fullscreen=yes';
	var url = '../relations/view';
 	newwin = window.open(url,'FullscreenGraph', params);
 	if (window.focus) {
		newwin.focus();
	}
	return false;
}

//Computes the popup view of the graph
/**
 * Computes the visualization of the graph in the pop up widow.
 * @param {RGraph} rgraph Current RGraph object that represent the graph.
 */
function computePopupVis(rgraph){
	var d = 0;
	var jsons = window.opener.jsons;
	var center = window.opener.center;
	for(i = 0; i < jsons.length - 1; i++){
		//var nodes = nodesToRemove(jsons[i+1], jsons[i]);
		rgraph.op.sum(jsons[i+1], {
			type: 'fade:seq',
			duration: d,
			hideLabels: true,
			transition: Trans.Quad.easeInOut,
			onComplete: function(){
				rgraph.onClick(center[center.length-1]);
			}
		});
		if(i+1 == jsons.length - 1){
			d = 500;
		}
	}
	overgraph = rgraph;
}

//Modifies the json to color the nodes and modifing the shape
/**
 * Modifies the received JSON object to have different colors and shapes depending on the type of nodes.
 * @param {JSON} json The JSON object to be modified.
 * @returns The modified JSON object.
 */
function modjson(json, flag){
	json.adjacencies = [];
	//alert(json.type);
	if(json.type === "Issue"){
		json.$type = "star";
		json.data.typology = "Issue";
	}
	else if(json.type === "Alternative"){
		json.$type = "square";
		json.data.typology = "Alternative";
		
	}
	else {
		json.$type = "circle";
		json.data.typology = "Tag";
	}
	
	json = childrenIteration(json);
	
	//alert(json.toString());
	if(flag){
	 overgraph.loadJSON(json);
	}
	return json;
}

//Function to iterate through each children of the node
/**
 * Iterates through the children of the given node and sets the right data objects.
 * @param {json} A json object that must be iterated.
 */
 function childrenIteration(json){
   for(var i = 0; i < json.children.length; i++){
    if(json.children[i].type == "Alternative"){
      json.children[i].data.$type = "square";
      json.children[i].data.typology = "Alternative";
    }
    else if(json.children[i].type == "Issue"){
      json.children[i].data.$type = "star";
      json.children[i].data.typology = "Issue";
    }
    else {
      json.children[i].data.$type = "circle";
      json.children[i].data.typology = "Tag";
    }
    
    if(json.children[i].children.length > 0){
      childrenIteration(json.children[i]);
    }
  }
  return json;
 }

//Function to check all at the beginning of the script
/**
 * Checks all the checkboxes that works for the view. Might be come handy in the future.
 */
function checkAll(){
	document.check.issue.checked = true;
	document.check.alternative.checked = true;
	document.check.tag.checked = true;
	whatIsChecked[0] = true;
	whatIsChecked[1] = true;
	whatIsChecked[2] = true;
}

//Method to control the checkboxes
/**
 * Controller for the checkboxes.
 * @param {String} c Type of the node to paint or delete from the graph.
 */
function controller(c){
	//Checks if issue has been clicked
	if(c == 'issues'){
		//If it's checked paint the issues
		if(document.check.issue.checked == true) {
			paint('Issue');
			whatIsChecked[0] = true;
		}
		else{
			remove('Issue');
			whatIsChecked[0] = false;
		}
	}
	
	if(c == 'alternatives'){
		if(document.check.alternative.checked == true){
			paint('Alternative');
			whatIsChecked[1] = true;
		}
		else{
			remove('Alternative');
			whatIsChecked[1] = false;
		}
	}
	
	if(c == 'tags'){
		if(document.check.tag.checked == true){
			paint('Tag');
			whatIsChecked[2] = true;
		}
		else{
			remove('Tag');
			whatIsChecked[2] = false;
		}
	}
}

//Method to check if a particular id was removed from the view
/**
 * Check what was removed from the graph. Useful for repainting the nodes that were previously deleted.
 * @param {Int} id ID of the node that is checked if was removed.
 * @param {String} c Type of the node that was removed.
 * @returns The node that was removed. It is in the form Node, wich is an object for the visualization.
 */
function wasRemoved(id, c){
	for(r = 0; r < removed_elements[c].length; r++){
		if (id == removed_elements[c][r].id) {
			return {
				"flag": true,
				"parent": removed_elements[c][r].parent
			};
		}
	}
	return {
		"flag": false
	};
}

//Method that paints what it's checked
/**
 * Paints the node that were removed from the view.
 * @param {String} c Type of the nodes that were removed and have to be painted back.
 */
 var toPaint = [];
function paint(c){
  toPaint = [];
	//var j = 0;
	for(var i = 0; i < jsons.length; i++){
	  paintNodes(jsons[i], c);
	}
	for(var m = 0; m < toPaint.length; m++){
      overgraph.graph.addNode(toPaint[m].node);
      //alert("adding " + toPaint[m].node.id + " with parent " + toPaint[m].parent);
    }
  for(var m = 0; m < toPaint.length; m++){
      overgraph.graph.addAdjacence(toPaint[m].node, overgraph.graph.getNode(toPaint[m].parent));
  }
	
	//Since there is a bug in the library, refresh twice to show the edges correctly.
	overgraph.refresh();
	overgraph.refresh();
	removed_elements[c] = new Array();
}


//Function that handles the tail recursion of the painting nodes
function paintNodes(json, c){
  var elem = wasRemoved(json.id, c)
  if(elem.flag){
    var node = {id : "", name: "", data: ""};
    node.id = json.id;
    node.name = json.name;
    node.data = json.data;
    toPaint.push({"node": node, "parent": elem.parent});
  }
  for(var k = 0; k < json.children.length; k++){
      var element = wasRemoved(json.children[k].id, c);
      if(element.flag){
        var node = {id : "", name: "", data: ""};
        node.id = json.children[k].id;
        node.name = json.children[k].name;
        node.data = json.children[k].data;
        toPaint.push({
          "node": node,
          "parent": element.parent
        });
      }
      alert("length of " + json.children[k].id + " is " + json.children[k].children.length);
      if(json.children[k].children.length > 0){
        //alert(json.children[k].id);
        paintNodes(json.children[k], c);
      }
    }
}

//Check if the node was not the center
/**
 * Checks that the received ID was not one of the center of the graph in previous modifications.
 * @param {Int} id ID of the node that has to be checked.
 * @returns A boolean if the node was a center.
 */
function notCenter(id){
	for(var i = 0; i < center.length; i ++){
		if(center[i] == id)
			return false;
	}
	return true;
}

//Method that removes what's not checked
/**
 * Function that removes certain types of nodes.
 * @param {String} c Type of nodes to be removed.
 */
 var removed = []; 
function remove(c){
  removed = [];
	for(var j = 0; j < jsons.length; j++){
	  removeNodes(jsons[j], c);
		/*for(k = 0; k < jsons[j].children.length; k++){
			if(jsons[j].children[k].data.typology === c && notCenter(jsons[j].children[k].id)){
				removed[i] = jsons[j].children[k].id;
				i++;
				removed_elements[c].push({
					"id": jsons[j].children[k].id,
					"parent": jsons[j].id
				});
			}
			else if(c == "Tag" && jsons[j].children[k].data.typology != 
					"Alternative" && jsons[j].children[k].data.typology != 
					"Issue" && notCenter(jsons[j].children[k].id)){
				removed[i] = jsons[j].children[k].id;
				i++;
				removed_elements[c].push({
					"id": jsons[j].children[k].id,
					"parent": jsons[j].id
				});
			}
		}*/
	}
	overgraph.op.removeNode(removed, {
				type: 'fade:seq',
				duration: 500,
				hideLabels: true,
				transition: Trans.Quad.easeInOut
	});
}

//This function does the action of removing phisically the nodes from the visualization
function removeNodes(json, c){
  for(var k = 0; k < json.children.length; k++){
    //alert("the son " + json.children[k].id + " has children " + json.children[k].children.length);
      if(json.children[k].children.length > 0){
        //alert(json.children[k].id + " has children!");
        removeNodes(json.children[k], c);
      }
      if(json.children[k].data.typology === c && notCenter(json.children[k].id)){
        //alert(json.children[k].name);
        removed.push(json.children[k].id);
        removed_elements[c].push({
          "id": json.children[k].id,
          "parent": json.id
        });
      }
      else if(c === "Tag" && json.children[k].data.typology !== 
          "Alternative" && json.children[k].data.typology !== 
          "Issue" && notCenter(json.children[k].id)){
            
        removed[i].push(json.children[k].id);
        removed_elements[c].push({
          "id": json.children[k].id,
          "parent": json.id
        });
      }
      
    }
}

//Removes elements from the json before it is plotted looking at the checkboxes status
/**
 * Removes the elements of a visualization (JSON object) according to the status of the checkboxes.
 * @param {JSON} JSON from which we need to remove the elements.
 */
function removeElementsBeforeVis(json){
	newjson = {
		"name": json.name,
		"type": json.type,
		"id": json.id,
		"children": [],
		"data": []
	}
	
	//Everything checked, we don't need to do anything
	if(document.check.tag.checked && document.check.issue.checked && document.check.alternative.checked){
		return json;
	}

	for (var i = 0; i < json.children.length; i++) {
		if (json.children[i].data.typology == "Issue"&& notCenter(json.children[i].id)) {
			if (!document.check.issue.checked ) {
				removed_elements['Issue'].push({
					"id": json.children[i].id,
					"parent": json.id
				});
			}
			else{
				newjson.children.push(json.children[i]);
			}
		}
		
		else if (json.children[i].data.typology == "Alternative" && notCenter(json.children[i].id)) {
			if (!document.check.alternative.checked) {
				removed_elements['Alternative'].push({
					"id": json.children[i].id,
					"parent": json.id
				});
			}
			else {
				newjson.children.push(json.children[i]);
			}
		}
		
		else if (json.children[i].data.typology == "Tag" && notCenter(json.children[i].id)) {
			if (!document.check.tag.checked) {
				removed_elements['Tag'].push({
					"id": json.children[i].id,
					"parent": json.id
				});
			}
			else{
				newjson.children.push(json.children[i]);
			}
		}
	}
	return newjson;
}
	
//Method to reset the view to the first one
/**
 * Reset the current view to the very first one. Sets the heatmap to black and then redraws it.
 */
function resetView(){
	var lbs = overgraph.fx.labels;
 	for (var label in lbs) {
   		if (lbs[label]) {
   		 	lbs[label].parentNode.removeChild(lbs[label]);
   		}
 	}
	overgraph.fx.labels = {};
	
	var firstJson = jsons[0];
	//alert(firstJson);
	index = 1;
	jsons = new Array();
	jsons[0] = firstJson;
	
 	overgraph.loadJSON(jsons[0]);
 	overgraph.refresh();
	overgraph.refresh();
	//Sets all the checkbuttons to true
	checkAll();
	turnBlack();
}

/*Utilities for the Balloons javascript library*/
   var balloon    = new Balloon;
   //BalloonConfig(balloon,'GBubble');

   // plain balloon tooltip
   var tooltip  = new Balloon;
   BalloonConfig(tooltip,'GPlain');

   // fading balloon
   var fader = new Balloon;
   BalloonConfig(fader,'GFade');

   // a plainer popup box
   var box         = new Box;
   BalloonConfig(box,'GBox');

   // a box that fades in/out
   var fadeBox         = new Box;
   BalloonConfig(fadeBox,'GBox');
   fadeBox.bgColor     = 'black';
   fadeBox.fontColor   = 'white';
   fadeBox.borderStyle = 'none';
   fadeBox.delayTime   = 200;
   fadeBox.allowFade   = true;
   fadeBox.fadeIn      = 750;
   fadeBox.fadeOut     = 200;


//Function to fade in/out the table with the information about the selected node
/**
 * Function to fade in/out the table with the information about the selected node.
 * @param {String} ID of the element we want to fade in/out.
 */
function fade(eid){
  var element = document.getElementById(eid);
  if(element == null)
    return;
   
  if(element.FadeState == null)
  {
    if(element.style.opacity == null
        || element.style.opacity == ''
        || element.style.opacity == '1')
    {
      element.FadeState = 2;
    }
    else
    {
      element.FadeState = -2;
    }
  }
   
  if(element.FadeState == 1 || element.FadeState == -1)
  {
    element.FadeState = element.FadeState == 1 ? -1 : 1;
    element.FadeTimeLeft = TimeToFade - element.FadeTimeLeft;
  }
  else
  {
    element.FadeState = element.FadeState == 2 ? -1 : 1;
    element.FadeTimeLeft = TimeToFade;
    setTimeout("animateFade(" + new Date().getTime() + ",'" + eid + "')", 33);
  }  
}

//Function that animates the fade in/out of the node's table
/**
 * Function that animates the fade in/out of the node's table
 * @param {double} The time it has to fade.
 * @param {String} ID of the element we want to fade in/out.
 */
function  animateFade(lastTick, eid){  
  var curTick = new Date().getTime();
  var elapsedTicks = curTick - lastTick;
 
  var element = document.getElementById(eid);
 
  if(element.FadeTimeLeft <= elapsedTicks)
  {
    element.style.opacity = element.FadeState == 1 ? '1' : '0';
    element.style.filter = 'alpha(opacity = '
        + (element.FadeState == 1 ? '100' : '0') + ')';
    element.FadeState = element.FadeState == 1 ? 2 : -2;
    return;
  }
 
  element.FadeTimeLeft -= elapsedTicks;
  var newOpVal = element.FadeTimeLeft/TimeToFade;
  if(element.FadeState == 1)
    newOpVal = 1 - newOpVal;

  element.style.opacity = newOpVal;
  element.style.filter = 'alpha(opacity = ' + (newOpVal*100) + ')';
 
  setTimeout("animateFade(" + curTick + ",'" + eid + "')", 33);
}

//Method to dynamically add nodes that are pushed by any user
/**
 * This function dynamically adds nodes that are pushed in the view by any user.
 * @param {int} Own ID of the node that is pushed.
 * @param {int} Parent ID of the pushed node
 * @param {Object} Data of the node.
 */
function addNewNode(ownId, parentId, data){
	//Add nodes only if the parent is in the graph, if not it's useless.
	if (overgraph.graph.hasNode(parentId)) {
		//Creating the instance node
		var newNode = {
			"id": ownId,
			"name": "",
			"data": data,
		}
		
		//Adding newly created node to the graph
		var fatherNode = overgraph.graph.getNode(parentId);
		overgraph.graph.addNode(newNode);
		overgraph.graph.addAdjacence(newNode, fatherNode);
	}
}

//Method to dynamicaly remove nodes that are removed by any user
/**
 * Method to dynamicaly remove nodes that are removed by any user
 * @param {int} Own ID of the node to be removed.
 * @param {int} Parent ID of the node that has to be removed.
 */
function deleteNode(ownId, parentId){
	//Remove nodes only if they are in the graph
	if (overgraph.graph.hasNode(ownId)) {
		overgraph.graph.removeAdjacence(ownId, parentId);
		overgraph.graph.removeNode(ownId);
	}
}

//Method to save the Tree status
/**
 * Saves the status of the tree in that particular moment.
 */
function saveTree(){
	localStorage.setItem('length of jsons for '+center[0], jsons.length);
	//alert(JSON.stringify(jsons[0]));
	for (var i = 0; i < jsons.length; i++) {
		localStorage.setItem('jsons '+ i +' for ' + center[0], JSON.stringify(jsons[i]));
		//document.writeln(JSON.stringify(jsons[i]);
		//alert("Json to save: " + JSON.stringify(jsons[i]));
	}
	
	//alert(nodeValue.length);
	
	localStorage.setItem('length of nodeValue for '+center[0], nodeValue.length);
	//alert(nodeValue.length);
	for (var i = 0; i < nodeValue.length; i++) {
		localStorage.setItem('nodeValue '+ i +' for ' + center[0], nodeValue[i]);
	}
}

//Method to load the previously saved tree
/**
 * Loads a previously saved tree.
 */
function loadTree(){
	var jsonsLength = localStorage.getItem('length of jsons for '+center[0]);
	var nodeValueLength = localStorage.getItem('length of nodeValue for '+center[0]);
	alert('nodeValueLength = ' + nodeValueLength + " and jsonsLength = "+jsonsLength);
	if(jsonsLength != null && nodeValueLength != null){
		for(var i = 0; i < jsonsLength; i++){
		  //alert(localStorage.getItem('jsons '+ i +' for ' + center[0]));
			var unparsedJson = eval('('+localStorage.getItem('jsons '+ i +' for ' + center[0])+')');
			var childrens = eval('(' + unparsedJson.children +')');
			unparsedJson.children = childrens;
			jsons[i] = unparsedJson;//parseStringFromChildren(unparsedJson);
			//alert(jsons[i].type);
			//document.writeln(typeof(unparsedJson.children));
			/*var print;
			typeof jsons[i].children === 'string' ? print = "string" : print = "no string"
			document.writeln(print);*/
		}
		
		for(var i = 0; i < nodeValueLength; i++){
			nodeValue[i] = localStorage.getItem('nodeValue '+ i +' for '+center[0]);
			//alert("nodeValue[i].id loaded: " + nodeValue[i].id);
		}
		
		  var lbs = overgraph.fx.labels;
      for (var label in lbs) {
        if (lbs[label]) {
          lbs[label].parentNode.removeChild(lbs[label]);
        }
    }
  overgraph.fx.labels = {};
		
		//for(var jsonObject in jsons){
		for(var i = 0; i < jsons.length; i++){
			//alert("jsonObject in iteration of jsons: " + jsons[i]);
			jsons[i] = modjson(jsons[i], true);
			//alert("typology = " + jsons[i].data.typology);
			//overgraph.loadJSON(jsons[i]);
		}
		
		overgraph.refresh();
		overgraph.refresh();
		
		//The status of the checkboxes has to be checked too!
		//checkAll();
		turnBlack(true);
		
		
	}
	
	else{
		alert("Warning: No previously tree saved!");
	}
}
//getMetric([69, 80]);
/**
 * Method to get the metrics of the nodes. Used (for now) with Issue nodes.
 * @param {Array[int]} Array of node ids of the nodes we are interested.
 */
 function getMetric(ids, pos){
  //alert(ids.toString());
  var url = "../metrics/descriptiveness?nodes=["+ids+"]";
  //alert(url);
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', url, true);
  xmlhttp.onreadystatechange = function() {
    if(xmlhttp.readyState == 3) {
      
    }
    if (xmlhttp.readyState == 4) {
      processMetricsResult(xmlhttp.responseText, ids, pos);
    }
  }
  xmlhttp.send(null);
 }
 
 /**
  * Function to make use of the metrics fetched in getMetrics()
  * @param {String} A JSON object still to be evaluated.
  * @param {Array[int]} Array of node ids of the nodes we are interested. 
  */
 function processMetricsResult(metricJson, ids, pos){
   //resetNodeValue();
   //alert(nodeValue[0]);
   //alert(metricJson);
   var metrics = eval('('+metricJson+')');
   //alert(ids.length);
   //alert(metrics[69]);
   for(var i = 0; i < ids.length; i++){
     //alert("lol");
     //alert(ids[i] + " and metric " + metrics[ids[i]]);
     //if(ids[i] === 69) alert(pos[i]);
     //alert(pos[i]);
     addNodeValue(ids[i], metrics[ids[i]], pos[i]);
  }
  drawMap();
 }
 
 function parseStringFromChildren(unparsedJson){
   jQuery.each(unparsedJson, function(entryIndex, entry){
     if(typeof(entry) === 'string' && (entry.charAt(0) === '[' || entry.charAt(0) === '{')){
       entry = eval('('+entry+')');
     }
   })
   return unparsedJson;
 }
 
 /**
  * Function to let the user choose the degree on which he wants to visualize the graph.
  */
 function degreeChooser(){
  var url = "http://localhost:3000/relations/tree?id=" + thisID + "&degree=" + (document.chooser.multipleDegree.selectedIndex + 1);
  //alert(document.chooser.multipleDegree.selectedIndex);
  jQuery.getJSON(url, function(data){
     //Reset tree
     var lbs = overgraph.fx.labels;
     for (var label in lbs) {
     if (lbs[label]) {
        lbs[label].parentNode.removeChild(lbs[label]);
      }
    }
    
    overgraph.fx.labels = {};
    
    //Load new JSON
    data = modjson(data);
    overgraph.loadJSON(data);
    jsons = [];
    jsons.push(data);
    overgraph.refresh();
    overgraph.refresh();
    //Sets all the checkbuttons to true
    checkAll();
    turnBlack();
    //createMap();
  });
 }
