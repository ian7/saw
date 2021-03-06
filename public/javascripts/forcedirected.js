/**
 * @author Masiar Babazadeh
 */

var labelType, useGradients, nativeTextSupport, animate, d = 100;
var jsons = [], overgraph, nodeValue = [], popUpVariable = false, thisID, whatIsChecked = [];
var  TimeToFade = 500.0;
var timerId = null;
var removed = []; 
var removed_elements = [3];
removed_elements['Issue'] = [];
removed_elements['Alternative'] = [];
removed_elements['Tag'] = [];
var toPaint = [];
var issueID = 0;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

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
 * This function initiate the force directed graph. It does all the computation needed to plot the graph.
 * @param {int} The ID of the node page the user is currently watching.
 */
function init(nodeid){
  thisID = nodeid;
  issueID = nodeid;
  var json;
   

  /* 
*/  
      //Change css of the elements for the tabs to work
      changecss('.ui-tabs', 'display', 'position: relative; padding: .2em; zoom: 1; none !important');
      changecss('.ui-tabs-hide', 'display', 'none !important');

  checkAll();
  InitTabs();
}

var visLoaded = false;

function InitTabs() {
	jQuery( "#tabs" ).bind( "tabsselect", function(event, ui) {
  
	  // if that's third tab, then calculate visualization
	  if( ui.index == 2 )
	  {
		renderGraph();
	  }
	});
}

function renderGraph() {
	  // if that's n-th call... just ignore
	  if( visLoaded == true ) {
	    return;
	  }
  
  
	  // if that's first call, then mark that we went through that already.
	  if( visLoaded == false ) {
	   visLoaded = true;
	   }

	  // logging done manualy..
	    elem = document.getElementById('log');
	    elem.innerHTML = "loading...";    
	    elem.style.left = (500 - elem.offsetWidth / 2) + 'px';


	  jQuery.getJSON("/relations/graph?id="+issueID , function(data){
    
    
	    jsons.push(data);
	    var json = data;
    
	    var fd = new $jit.ForceDirected({
	    //id of the visualization container
	    injectInto: 'infovis',
	    //Enable zooming and panning
	    //with scrolling and DnD
	    Navigation: {
	      enable: true,
	      //Enable panning events only if we're dragging the empty
	      //canvas (and not a node).
	      panning: 'avoid nodes',
	      zooming: 10 //zoom speed. higher is more sensible
	    },
	    // Change node and edge styles such as
	    // color and width.
	    // These properties are also set per node
	    // with dollar prefixed data-properties in the
	    // JSON structure.
	    Node: {
	      overridable: true,
	      dim: 0.1
	    },
	    Edge: {
	      overridable: true,
	      color: '#23A4FF',
	      lineWidth: 3.0
	    },
	    // Add node events
	    Events: {
	      enable: true,
	      type: 'auto',
	      //Change cursor style when hovering a node
	      onMouseEnter: function() {
	        fd.canvas.getElement().style.cursor = 'move';
	      },
	      onMouseLeave: function() {
	        fd.canvas.getElement().style.cursor = '';
	      },
	      //Update node positions when dragged
	      onDragMove: function(node, eventInfo, e) {
	        var pos = eventInfo.getPos();
	        node.pos.setc(pos.x, pos.y);
	        fd.plot();
	      },
	      onTouchEnd: function(node, eventInfo, e){
	        alert("drag ended!");
	      },
	      //Implement the same handler for touchscreens
	      onTouchMove: function(node, eventInfo, e) {
	        $jit.util.event.stop(e); //stop default touchmove event
	        this.onDragMove(node, eventInfo, e);
	      },
      
	      onMouseWheel: function(delta, e){
	        timerId = clearTimeout(timerId); 
	        timerId = setTimeout(onMouseWheelCallback, 1500); 
	      }
      
	    },
	    //Number of iterations for the FD algorithm
	    iterations: 200,
	    //Edge length
	    levelDistance: 130,
	    // This method is only triggered
	    // on label creation and only for DOM labels (not native canvas ones).
	    onCreateLabel: function(domElement, node){
	      //Icons instead of circles
	      if (node.data.type === "Issue") {
	        //alert(node.id);
	        domElement.innerHTML = "<span onmouseover=\"fadeBox.showTooltip(event,'" + node.name + "')\">"+
	        "<img src='/images/issue_cloud.png' onmousedown='if (event.preventDefault) event.preventDefault()'></img></span>";
	      }
	      else 
	        if (node.data.type === "Alternative") {
	          domElement.innerHTML = "<span onmouseover=\"fadeBox.showTooltip(event,'" + node.name + "')\">"+
	          "<img src='/images/alternative_cloud.png' onmousedown='if (event.preventDefault) event.preventDefault()'></img></span>";
	        }
	        else {
	          //node.id === 69 ? alert("nodeid = 69")
	          domElement.innerHTML = "<span onmouseover=\"fadeBox.showTooltip(event,'" + node.name + "')\">"+
	          "<img src='/images/tag.png' onmousedown='if (event.preventDefault) event.preventDefault()'></img></span>";
	        }
        
	      //Table of information about the node
	      domElement.onclick = function(){
	        fade('infonode');
	        //document.getElementById('infonode').style.opacity = 0;
	        var path = '/taggables/'+node.id;
	        setTimeout("getHTML('/taggables/'+"+node.id+")", TimeToFade);
	      }
      
	      //Expand the node
	      domElement.ondblclick = function(){
	        jQuery.getJSON("/relations/graph?id=" + node.id, function(data){
	          fd.op.sum(data, {
	            type: 'fade:con',  
	            duration: 500  
	          });
	          jsons.push(data);
	        });
	      }
	    },
	    // Change node styles when DOM labels are placed
	    // or moved.
	    onPlaceLabel: function(domElement, node){
	      var style = domElement.style;
	      var left = parseInt(style.left);
	      var top = parseInt(style.top);
	      var w = domElement.offsetWidth;
	      style.left = (left - w / 2 - 0) + 'px';
	      style.top = (top + 10 - 23) + 'px';
	      style.display = '';
	    }
	  });
	  //Reduce size of the canvas
	  //document.getElementById('infovis-canvaswidget').style.width = '800px';
	  // load JSON data.


	   fd.loadJSON(json);
	  // compute positions incrementally and animate.
	  fd.computeIncremental({
	    iter: 10,
	    property: 'end',
	    onStep: function(perc){
	      Log.write(perc + '% loaded...');
	    },
	    onComplete: function(){
	      Log.write('');
	      fd.animate({
	        modes: ['linear'],
	        transition: $jit.Trans.Elastic.easeOut,
	        duration: 10
	      });
	      overgraph = fd;
      
	      //Change css of the elements for the tabs to work
	  //    changecss('.ui-tabs', 'display', 'position: relative; padding: .2em; zoom: 1; none !important');
	  //  changecss('.ui-tabs-hide', 'display', 'none !important');
	    }
	  });
	 });
	}    
	  
	


/*
jQuery( "#fragment-2" ).bind( "tabsselect", function(event, ui) {
});

*/



/**
 * Function to manage the radio buttons for the heatmap.
 * @param {String} The button clicked by the user.
 */
 function manageMetricsButton(buttonClicked){
   var result = buttonClicked.split("_");
   //result[0] will be the color, result[1] the metric
   createMap(result[1], result[0]);
 }

/**
 * Function to check if the current JSON has been already added to the jsons array.
 * @param {Object} A newborn JSON object.
 */
function checkForDoubleJson(json){
  for(var i = 0; i < jsons.length; i++){
    if(jsons[i].id === json.id){
      return false;
    }
  }
  return true;
}

/**
 * OnMouseWheelCallback to handle when the mouse wheel stops.
 */
 function onMouseWheelCallback(){
   createMap(lastMetric, lastColor, true);
 }
 
 /**
 * Function to add an object that contains a node ID, a value and a position to the nodeValue array.
 * @param {int} ID of the node we want to add.
 * @param {int} The value of the node.
 * @param {int[]} The array containing the position of the node of the form [x, y].
 */
 function addNodeValue(nodeId, value, position){
  for(var i = 0; i<nodeValue.length; i++){
    if(nodeId === nodeValue[i].id){
       
       nodeValue[i].value = value;
       nodeValue[i].position = position;
       return; //refreshed the node
    }
  }
  
  value = value === undefined ? 0 : value; //check for the undefineteness of the value
  nodeValue.push({id: nodeId, value: value, position: position});
  return true;
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
      document.getElementById('infonode').innerHTML = xmlhttp.responseText.replace("<table>", "<table class='infotable'>");///*xmlhttp.responseText*/finalsum.replace("<table>", "<table class='infotable'>");
      fade('infonode');
    }
  }
  xmlhttp.send(null);
}

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

/*Utilities for the Balloons javascript library*/
   var balloon    = new Balloon;

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
   
/**
 * Slider Stuff
 */
 
// jQuery(document).ready(function() {
function InitUI() {
    jQuery("#slider-delta").slider();
    jQuery("#slider-beta").slider();
    
    jQuery( "#slider-delta" ).slider({ max: 20 });
    jQuery( "#slider-beta" ).slider({ max: 20 });
    
    jQuery( "#slider-delta" ).slider({ min: 1 });
    jQuery( "#slider-beta" ).slider({ min: 0 });
    
    jQuery( "#slider-delta" ).slider({ value: deltaValue });
    jQuery( "#slider-beta" ).slider({ value: beta });
    document.getElementById("deltaValue").innerHTML = deltaValue;
    document.getElementById("betaValue").innerHTML = beta;
    
    //Callbacks
    jQuery( "#slider-delta" ).slider({
      change: function(event, ui) {
        deltaValue = ui.value;
        document.getElementById("deltaValue").innerHTML = ui.value;
        if(lastMetric != undefined && lastColor != undefined)
          createMap(lastMetric, lastColor, true);
      }
    });
    
    jQuery( "#slider-beta" ).slider({
      change: function(event, ui) {
        beta = ui.value;
        document.getElementById("betaValue").innerHTML = ui.value;
        if(lastMetric != undefined && lastColor != undefined)
          createMap(lastMetric, lastColor, true);
      }
    });
  }
  
   /**
  * Function to let the user choose the degree on which he wants to visualize the graph.
  */
 function degreeChooser(){
  var url = "/relations/graph?id=" + thisID + "&degree=" + (document.chooser.multipleDegree.selectedIndex + 1);
  //alert(document.chooser.multipleDegree.selectedIndex);
  jQuery.getJSON(url, function(data){
      overgraph.loadJSON(data);

      overgraph.computeIncremental({
        iter: 40,
        property: 'end',
        onStep: function(perc){
          Log.write(perc + '% loaded...');
        },
        onComplete: function(){
          Log.write('');
          overgraph.animate({
          modes: ['linear'],
          transition: $jit.Trans.Elastic.easeOut,
          duration: 2500
          });
        }
      });
  });
 }
 
 /*---------- Filtering Things ----------*/
 /**
 * Checks all the checkboxes that works for the view. Might become handy in the future.
 */
function checkAll(){
  document.check.issue.checked = true;
  document.check.alternative.checked = true;
  document.check.tag.checked = true;
  whatIsChecked[0] = true;
  whatIsChecked[1] = true;
  whatIsChecked[2] = true;
}

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

/*---------- Remove Stuff ----------*/

/**
 * Checks if the type of the node given is checked or not.
 * @param {String} The type of nodes wanted to be checked.
 */
function checked(type){
   if(type === "Issue" && document.check.issue.checked){
    return true;
   }
   else if(type ==="Alternative" && document.check.alternative.checked){
    return true;
   }
   else if(document.check.tag.checked && type !== "Issue" && type !== "Alternative"){
     return true;
   }
   
   return false;
}

/**
 * Function to clone an object, used to keep the jsons alive.
 * @param {Object} The object to be cloned.
 */
function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = new obj.constructor(); // changed (twice)
    for(var key in obj)
        temp[key] = clone(obj[key]);

    return temp;
}

/**
 * Function that removes certain types of nodes.
 * @param {String} c Type of nodes to be removed.
 */
function remove(c){
  var copyjsons = clone(jsons);
  var newjson = [];
  for(var i = 0; i < copyjsons.length; i++){
    for(var j = 0; j < copyjsons[i].length; j++){
      if(checked(copyjsons[i][j].data.type)|| j == 0){
        newjson.push(copyjsons[i][j]);
      }
    }
  }
  
  var foundNF = false, foundNT = false;
  for(var i = 0; i < newjson.length; i++){
    //Starts from 1 because the first element is the id of the node in String type.
    for(var j = 1; j < newjson[i].adjacencies.length; j++){
      foundNF = false;
      foundNT = false;
      
      for(var k = 0; k < newjson.length; k++){
        if(newjson[k].id === newjson[i].adjacencies[j].nodeFrom){
          foundNF = true;
        }
        if(newjson[k].id === newjson[i].adjacencies[j].nodeTo){
          foundNT = true;
        }
      
      }
      
      if(foundNT === false || foundNF === false){
        //alert("removing " + filteredjson[i].adjacencies[j].nodeFrom + " or " + filteredjson[i].adjacencies[j].nodeTo);
        newjson[i].adjacencies.splice(j, 1);
        j=0;
      }
      
    }
  }
  reload(newjson);
}

/**
 * This function reloads the graph according to the new JSON object provided.
 * @param {JSON} A JSON object to be loaded in the graph.
 */
function reload(newjson){
  overgraph.loadJSON(newjson);

      overgraph.computeIncremental({
        iter: 40,
        property: 'end',
        onStep: function(perc){
          Log.write(perc + '% loaded...');
        },
        onComplete: function(){
          Log.write('');
          overgraph.animate({
          modes: ['linear'],
          transition: $jit.Trans.Elastic.easeOut,
          duration: 2500
          });
        }
      });
}

/*---------- Paint stuff ----------*/
/**
 * Paints the node that were removed from the view.
 * @param {String} c Type of the nodes that were removed and have to be painted back.
 */
function paint(c){
  //Everything checked
  if(document.check.issue.checked && document.check.alternative.checked &&  document.check.tag.checked){
    reload(jsons[0]);
  }
  
  //If something is still not checked
  else if(!document.check.issue.checked){
    remove("Issue");
  }
  else if(!document.check.alternative.checked){
    remove("Alternative");
  }
  else if(!document.check.tag.checked){
    remove("Tag");
  }
}

/**
 * Function that gathers the nodes that have to be painted back on the graph.
 * @param {Object} A JSON object that contains the information to paint back the nodes.
 * @param {String} The type of nodes that has to be painted back.
 */
function paintNodes(json, c){
  for(var k = 0; k < json.length; k++){
      var element = wasRemoved(json[k].id, c);
      if(element.flag){
        var node = {id : "", name: "", data: ""};
        node.id = json[k].id;
        node.name = json[k].name;
        node.data = json[k].data;
        node.adjacencies = json[k].ajacencies;
        toPaint.push(node);
      }
    }
}

/**
 * Check what was removed from the graph. Useful for repainting the nodes that were previously deleted.
 * @param {Int} id ID of the node that is checked if was removed.
 * @param {String} c Type of the node that was removed.
 * @returns The node that was removed. It is in the form Node, wich is an object for the visualization.
 */
function wasRemoved(id, c){
  for(var r = 0; r < removed_elements[c].length; r++){
    if (id == removed_elements[c][r].id) {
      return {
        "flag": true
      };
    }
  }
  return {
    "flag": false
  };
}