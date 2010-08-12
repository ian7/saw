var labelType, useGradients, nativeTextSupport, animate, d = 2500;
var jsons = [], overgraph, nodeValue = [], popUpVariable = false;
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
      dim: 7
    },
    Edge: {
      overridable: true,
      color: '#23A4FF',
      lineWidth: 0.4
    },
    // Add node events
    Events: {
      enable: true,
      type: 'Native',
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
      //Implement the same handler for touchscreens
      onTouchMove: function(node, eventInfo, e) {
        $jit.util.event.stop(e); //stop default touchmove event
        this.onDragMove(node, eventInfo, e);
      }
    },
    //Number of iterations for the FD algorithm
    iterations: 200,
    //Edge length
    levelDistance: 130,
    // This method is only triggered
    // on label creation and only for DOM labels (not native canvas ones).
    onCreateLabel: function(domElement, node){
      // Create a 'name' and 'close' buttons and add them
      // to the main node label
      var nameContainer = document.createElement('span'),
          closeButton = document.createElement('span'),
          style = nameContainer.style;
      nameContainer.className = 'name';
      nameContainer.innerHTML = node.name;
      closeButton.className = 'close';
      closeButton.innerHTML = 'x';
      domElement.appendChild(nameContainer);
      domElement.appendChild(closeButton);
      style.fontSize = "0.8em";
      style.color = "#ddd";
      //Fade the node and its connections when
      //clicking the close button
      closeButton.onclick = function() {
        node.setData('alpha', 0, 'end');
        node.eachAdjacency(function(adj) {
          adj.setData('alpha', 0, 'end');
        });
        fd.fx.animate({
          modes: ['node-property:alpha',
                  'edge-property:alpha'],
          duration: 500
        });
      };
      //Toggle a node selection when clicking
      //its name. This is done by animating some
      //node styles like its dimension and the color
      //and lineWidth of its adjacencies.
      nameContainer.onclick = function() {
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
      };
    },
    // Change node styles when DOM labels are placed
    // or moved.
    onPlaceLabel: function(domElement, node){
      var style = domElement.style;
      var left = parseInt(style.left);
      var top = parseInt(style.top);
      var w = domElement.offsetWidth;
      style.left = (left - w / 2) + 'px';
      style.top = (top + 10) + 'px';
      style.display = '';
    }
  });
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
        duration: d
      });
      overgraph = fd;
      setTimeout("createMap()", d);
    }
  });
  
  
  });
  //end
  // init ForceDirected
  
  // end
  
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
