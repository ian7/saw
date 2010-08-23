var labelType, useGradients, nativeTextSupport, animate, d = 100;
var jsons = [], overgraph, nodeValue = [], popUpVariable = false;
var  TimeToFade = 500.0;
var timerId = null; 

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


function init(nodeid){
  // init data
  //var json = [{"name":"ServiceCompositionParadigm","id":"69","adjacencies":["69",{"nodeFrom":"69","nodeTo":"81","data":{"$color":"#557EAA"}},{"nodeFrom":"69","nodeTo":"200","data":{"$color":"#557EAA"}},{"nodeFrom":"69","nodeTo":"208","data":{"$color":"#557EAA"}},{"nodeFrom":"69","nodeTo":"216","data":{"$color":"#557EAA"}},{"nodeFrom":"70","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"72","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"74","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"76","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"78","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"33","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"274","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"280","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"286","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"292","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"298","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"304","nodeTo":"69","data":{"$color":"#557EAA"}}],"data":{"$type":"circle","$color":"#83548B","$dim":10}},{"name":"ServiceCompositionLanguage","id":"81","adjacencies":["81",{"nodeFrom":"81","nodeTo":"91","data":{"$color":"#557EAA"}},{"nodeFrom":"81","nodeTo":"110","data":{"$color":"#557EAA"}},{"nodeFrom":"81","nodeTo":"224","data":{"$color":"#557EAA"}},{"nodeFrom":"82","nodeTo":"81","data":{"$color":"#557EAA"}},{"nodeFrom":"72","nodeTo":"81","data":{"$color":"#557EAA"}},{"nodeFrom":"85","nodeTo":"81","data":{"$color":"#557EAA"}},{"nodeFrom":"76","nodeTo":"81","data":{"$color":"#557EAA"}},{"nodeFrom":"88","nodeTo":"81","data":{"$color":"#557EAA"}},{"nodeFrom":"39","nodeTo":"81","data":{"$color":"#557EAA"}},{"nodeFrom":"306","nodeTo":"81","data":{"$color":"#557EAA"}},{"nodeFrom":"312","nodeTo":"81","data":{"$color":"#557EAA"}},{"nodeFrom":"318","nodeTo":"81","data":{"$color":"#557EAA"}},{"nodeFrom":"324","nodeTo":"81","data":{"$color":"#557EAA"}},{"nodeFrom":"330","nodeTo":"81","data":{"$color":"#557EAA"}},{"nodeFrom":"336","nodeTo":"81","data":{"$color":"#557EAA"}},{"nodeFrom":"338","nodeTo":"81","data":{"$color":"#557EAA"}},{"nodeFrom":"69","nodeTo":"81","data":{"$color":"#557EAA"}}],"data":{"$type":"circle","$color":"#83548B","$dim":10}},{"name":"ResourceProtectionStrategy","id":"200","adjacencies":["200",{"nodeFrom":"200","nodeTo":"99","data":{"$color":"#557EAA"}},{"nodeFrom":"200","nodeTo":"208","data":{"$color":"#557EAA"}},{"nodeFrom":"200","nodeTo":"224","data":{"$color":"#557EAA"}},{"nodeFrom":"82","nodeTo":"200","data":{"$color":"#557EAA"}},{"nodeFrom":"102","nodeTo":"200","data":{"$color":"#557EAA"}},{"nodeFrom":"74","nodeTo":"200","data":{"$color":"#557EAA"}},{"nodeFrom":"76","nodeTo":"200","data":{"$color":"#557EAA"}},{"nodeFrom":"205","nodeTo":"200","data":{"$color":"#557EAA"}},{"nodeFrom":"12","nodeTo":"200","data":{"$color":"#557EAA"}},{"nodeFrom":"484","nodeTo":"200","data":{"$color":"#557EAA"}},{"nodeFrom":"490","nodeTo":"200","data":{"$color":"#557EAA"}},{"nodeFrom":"496","nodeTo":"200","data":{"$color":"#557EAA"}},{"nodeFrom":"502","nodeTo":"200","data":{"$color":"#557EAA"}},{"nodeFrom":"504","nodeTo":"200","data":{"$color":"#557EAA"}},{"nodeFrom":"69","nodeTo":"200","data":{"$color":"#557EAA"}}],"data":{"$type":"circle","$color":"#83548B","$dim":10}},{"name":"TransactionCoordinator","id":"208","adjacencies":["208",{"nodeFrom":"208","nodeTo":"208","data":{"$color":"#557EAA"}},{"nodeFrom":"208","nodeTo":"99","data":{"$color":"#557EAA"}},{"nodeFrom":"82","nodeTo":"208","data":{"$color":"#557EAA"}},{"nodeFrom":"102","nodeTo":"208","data":{"$color":"#557EAA"}},{"nodeFrom":"74","nodeTo":"208","data":{"$color":"#557EAA"}},{"nodeFrom":"76","nodeTo":"208","data":{"$color":"#557EAA"}},{"nodeFrom":"213","nodeTo":"208","data":{"$color":"#557EAA"}},{"nodeFrom":"12","nodeTo":"208","data":{"$color":"#557EAA"}},{"nodeFrom":"506","nodeTo":"208","data":{"$color":"#557EAA"}},{"nodeFrom":"508","nodeTo":"208","data":{"$color":"#557EAA"}},{"nodeFrom":"510","nodeTo":"208","data":{"$color":"#557EAA"}},{"nodeFrom":"512","nodeTo":"208","data":{"$color":"#557EAA"}},{"nodeFrom":"208","nodeTo":"208","data":{"$color":"#557EAA"}},{"nodeFrom":"69","nodeTo":"208","data":{"$color":"#557EAA"}},{"nodeFrom":"200","nodeTo":"208","data":{"$color":"#557EAA"}}],"data":{"$type":"circle","$color":"#83548B","$dim":10}},{"name":"CompensationMechanism","id":"216","adjacencies":["216",{"nodeFrom":"216","nodeTo":"224","data":{"$color":"#557EAA"}},{"nodeFrom":"82","nodeTo":"216","data":{"$color":"#557EAA"}},{"nodeFrom":"102","nodeTo":"216","data":{"$color":"#557EAA"}},{"nodeFrom":"74","nodeTo":"216","data":{"$color":"#557EAA"}},{"nodeFrom":"134","nodeTo":"216","data":{"$color":"#557EAA"}},{"nodeFrom":"221","nodeTo":"216","data":{"$color":"#557EAA"}},{"nodeFrom":"12","nodeTo":"216","data":{"$color":"#557EAA"}},{"nodeFrom":"514","nodeTo":"216","data":{"$color":"#557EAA"}},{"nodeFrom":"520","nodeTo":"216","data":{"$color":"#557EAA"}},{"nodeFrom":"526","nodeTo":"216","data":{"$color":"#557EAA"}},{"nodeFrom":"532","nodeTo":"216","data":{"$color":"#557EAA"}},{"nodeFrom":"538","nodeTo":"216","data":{"$color":"#557EAA"}},{"nodeFrom":"540","nodeTo":"216","data":{"$color":"#557EAA"}},{"nodeFrom":"69","nodeTo":"216","data":{"$color":"#557EAA"}}],"data":{"$type":"circle","$color":"#83548B","$dim":10}},{"name":"Project","id":"70","adjacencies":["70",{"nodeFrom":"70","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"70","nodeTo":"91","data":{"$color":"#557EAA"}}],"data":{"$type":"circle","$color":"#83548B","$dim":10}},{"name":"Solution outline","id":"72","adjacencies":["72",{"nodeFrom":"72","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"72","nodeTo":"81","data":{"$color":"#557EAA"}},{"nodeFrom":"72","nodeTo":"91","data":{"$color":"#557EAA"}}],"data":{"$type":"circle","$color":"#83548B","$dim":10}},{"name":"Technology-level refinement","id":"74","adjacencies":["74",{"nodeFrom":"74","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"74","nodeTo":"99","data":{"$color":"#557EAA"}},{"nodeFrom":"74","nodeTo":"120","data":{"$color":"#557EAA"}},{"nodeFrom":"74","nodeTo":"200","data":{"$color":"#557EAA"}},{"nodeFrom":"74","nodeTo":"208","data":{"$color":"#557EAA"}},{"nodeFrom":"74","nodeTo":"216","data":{"$color":"#557EAA"}},{"nodeFrom":"74","nodeTo":"234","data":{"$color":"#557EAA"}},{"nodeFrom":"74","nodeTo":"242","data":{"$color":"#557EAA"}}],"data":{"$type":"circle","$color":"#83548B","$dim":10}},{"name":"Lead architect","id":"76","adjacencies":["76",{"nodeFrom":"76","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"76","nodeTo":"81","data":{"$color":"#557EAA"}},{"nodeFrom":"76","nodeTo":"91","data":{"$color":"#557EAA"}},{"nodeFrom":"76","nodeTo":"200","data":{"$color":"#557EAA"}},{"nodeFrom":"76","nodeTo":"208","data":{"$color":"#557EAA"}}],"data":{"$type":"circle","$color":"#83548B","$dim":10}},{"name":"N151262567-51103476","id":"78","adjacencies":["78",{"nodeFrom":"78","nodeTo":"69","data":{"$color":"#557EAA"}}],"data":{"$type":"circle","$color":"#83548B","$dim":10}},{"name":"EnterpriseApplicationArchitectureDecisions","id":"33","adjacencies":["33",{"nodeFrom":"33","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"34","nodeTo":"33","data":{"$color":"#557EAA"}},{"nodeFrom":"36","nodeTo":"33","data":{"$color":"#557EAA"}}],"data":{"$type":"circle","$color":"#83548B","$dim":10}},{"name":"Service Composition Layer (SCL) and workflow pattern (Layer 4)","id":"274","adjacencies":["274",{"nodeFrom":"274","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"275","nodeTo":"274","data":{"$color":"#557EAA"}},{"nodeFrom":"277","nodeTo":"274","data":{"$color":"#557EAA"}}],"data":{"$type":"circle","$color":"#83548B","$dim":10}},{"name":"Programming language component model (Layer 2)","id":"280","adjacencies":["280",{"nodeFrom":"280","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"281","nodeTo":"280","data":{"$color":"#557EAA"}},{"nodeFrom":"283","nodeTo":"280","data":{"$color":"#557EAA"}}],"data":{"$type":"circle","$color":"#83548B","$dim":10}},{"name":"Portal or mashup (Layer 5)","id":"286","adjacencies":["286",{"nodeFrom":"286","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"287","nodeTo":"286","data":{"$color":"#557EAA"}},{"nodeFrom":"289","nodeTo":"286","data":{"$color":"#557EAA"}}],"data":{"$type":"circle","$color":"#83548B","$dim":10}},{"name":"Integration layer (Layer 6)","id":"292","adjacencies":["292",{"nodeFrom":"292","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"293","nodeTo":"292","data":{"$color":"#557EAA"}},{"nodeFrom":"295","nodeTo":"292","data":{"$color":"#557EAA"}}],"data":{"$type":"circle","$color":"#83548B","$dim":10}},{"name":"None (human user invoking atomic business functions)","id":"298","adjacencies":["298",{"nodeFrom":"298","nodeTo":"69","data":{"$color":"#557EAA"}},{"nodeFrom":"299","nodeTo":"298","data":{"$color":"#557EAA"}},{"nodeFrom":"301","nodeTo":"298","data":{"$color":"#557EAA"}}],"data":{"$type":"circle","$color":"#83548B","$dim":10}},{"name":"Not applicable","id":"304","adjacencies":["304",{"nodeFrom":"304","nodeTo":"69","data":{"$color":"#557EAA"}}],"data":{"$type":"circle","$color":"#83548B","$dim":10}}];
  var json;
  jQuery.getJSON("../relations/graph?id=" + nodeid , function(data){
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
      lineWidth: 0.4
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
        //createMap();
      },
      //Implement the same handler for touchscreens
      onTouchMove: function(node, eventInfo, e) {
        $jit.util.event.stop(e); //stop default touchmove event
        this.onDragMove(node, eventInfo, e);
      },
      
      onMouseWheel: function(delta, e){
        timerId = clearTimeout(timerId); 
        timerId = setTimeout(onMouseWheelCallback, 500); 
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
        "<img src='../images/issue_cloud.png' onmousedown='if (event.preventDefault) event.preventDefault()'></img></span>";
      }
      else 
        if (node.data.type === "Alternative") {
          domElement.innerHTML = "<span onmouseover=\"fadeBox.showTooltip(event,'" + node.name + "')\">"+
          "<img src='../images/alternative_cloud.png' onmousedown='if (event.preventDefault) event.preventDefault()'></img></span>";
        }
        else {
          //node.id === 69 ? alert("nodeid = 69")
          domElement.innerHTML = "<span onmouseover=\"fadeBox.showTooltip(event,'" + node.name + "')\">"+
          "<img src='../images/tag.png' onmousedown='if (event.preventDefault) event.preventDefault()'></img></span>";
        }
      
      //Adjust label position
      
      
      //Table of information about the node
      domElement.onclick = function(){
        fade('infonode');
        //document.getElementById('infonode').style.opacity = 0;
        var path = '../taggables/'+node.id;
        setTimeout("getHTML('../taggables/'+"+node.id+")", TimeToFade);
      }
      // Create a 'name' and 'close' buttons and add them
      // to the main node label
      /*var nameContainer = document.createElement('span'),
          closeButton = document.createElement('span'),
          style = nameContainer.style;
      nameContainer.className = 'name';
      nameContainer.innerHTML = node.name;
      closeButton.className = 'close';
      closeButton.innerHTML = 'x';
      domElement.appendChild(nameContainer);
      domElement.appendChild(closeButton);
      style.fontSize = "0.8em";
      style.color = "#ddd"; */
      //Fade the node and its connections when
      //clicking the close button
      /*closeButton.onclick = function() {
        node.setData('alpha', 0, 'end');
        node.eachAdjacency(function(adj) {
          adj.setData('alpha', 0, 'end');
        });
        fd.fx.animate({
          modes: ['node-property:alpha',
                  'edge-property:alpha'],
          duration: 500
        });
        drawMap();
      };*/
      //Toggle a node selection when clicking
      //its name. This is done by animating some
      //node styles like its dimension and the color
      //and lineWidth of its adjacencies.
      /*domElement.onclick = function() {
        //ADDED PART
        //sum new json
        jQuery.getJSON("../relations/graph?id=" + node.id + "", function(data){
          //Check if this node has already been clicked, if not add the json and plot it
          if(checkForDoubleJson(data)){
            jsons.push(data);
            fd.op.sum(data, {  
              type: 'fade:seq',  
              duration: 1000,  
              hideLabels: false,  
              transition: $jit.Trans.Quart.easeOut  
            });
          }
          drawMap();
        });
        //END ADDED PART
        //set final styles
        fd.graph.eachNode(function(n) {
          if(n.id != node.id) delete n.selected;
          n.setData('dim', 7, 'end');
          n.eachAdjacency(function(adj) {
            adj.setDataset('end', {
              lineWidth: 0.4,
              color: '#23a4ff'
            });
          });
        });
        if(!node.selected) {
          node.selected = true;
          node.setData('dim', 17, 'end');
          node.eachAdjacency(function(adj) {
            adj.setDataset('end', {
              lineWidth: 3,
              color: '#36acfb'
            });
          });
        } else {
          delete node.selected;
        }
        //trigger animation to final styles
        fd.fx.animate({
          modes: ['node-property:dim',
                  'edge-property:lineWidth:color'],
          duration: 500
        });
        // Build the right column relations list.
        // This is done by traversing the clicked node connections.
        var html = "<h4>" + node.name + "</h4><b> connections:</b><ul><li>",
            list = [];
        node.eachAdjacency(function(adj){
          if(adj.getData('alpha')) list.push(adj.nodeTo.name);
        });
        //append connections information
        $jit.id('inner-details').innerHTML = html + list.join("</li><li>") + "</li></ul>";
      };*/
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
    iter: 40,
    property: 'end',
    onStep: function(perc){
      Log.write(perc + '% loaded...');
    },
    onComplete: function(){
      Log.write('done');
      fd.animate({
        modes: ['linear'],
        transition: $jit.Trans.Elastic.easeOut,
        duration: 0
      });
      overgraph = fd;
      
      //Change css of the elements for the tabs to work
      changecss('.ui-tabs', 'display', 'position: relative; padding: .2em; zoom: 1; none !important');
      changecss('.ui-tabs-hide', 'display', 'none !important');
      //setTimeout("createMap()", d);
    }
  });
  
  
  });
  //end
  // init ForceDirected
  
  // end
  
}

/**
 * Function to manage the radio buttons for the heatmap
 */
 function manageMetricsButton(buttonClicked){
   var result = buttonClicked.split("_");
   //result[0] will be the color, result[1] the metric
   createMap(result[1], result[0]);
 }

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
   
/**
 * Slider Stuff
 */
 
 jQuery(document).ready(function() {
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
  });
