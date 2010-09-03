var Log = {
    elem: false,
    write: function(text){
        if (!this.elem) 
            this.elem = document.getElementById('log');
        this.elem.innerHTML = text;
        this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
    }
};

function addEvent(obj, type, fn) {
    if (obj.addEventListener) obj.addEventListener(type, fn, false);
    else obj.attachEvent('on' + type, fn);
};

function init(id, relation){
}

function callback(json){
	function get(id) {
      return document.getElementById(id);  
    };
    //end
    var infovis = document.getElementById('infovis');
    
    /*var w = infovis.offsetWidth, h = infovis.offsetHeight;
    //init canvas
    //Create a new canvas instance.
    var canvas = new Canvas('mycanvas', {
        'injectInto': 'infovis',
        'width': w,
        'height': h,
        'backgroundColor': '#1a1a1a'
    });
    //end
    */
    //init st
    //Create a new ST instance
    var st = new $jit.ST({
        // set div object
        injectInto: 'infovis',
        //set duration for the animation
        duration: 800,
        //set animation transition type
        transition: $jit.Trans.Quart.easeInOut,
        //set distance between node and its children
        levelDistance: 50,
        //set node and edge styles
        //set overridable=true for styling individual
        //nodes or edges
        Node: {
            height: 20,
            width: 60,
            type: 'rectangle',
            color: '#aaa',
            overridable: true
        },
        
        Edge: {
            type: 'bezier',
            overridable: true
        },
        
        onBeforeCompute: function(node){
            Log.write("loading " + node.name);
			
			var html = "<h2>" + node.name + "</h2>";
			// if it is a leaf
			if($jit.Graph.Util.getSubnodes(node).length == 1) {
				// I'll add a link to create a new TAG
				html += '<div class="link"><a href="tags/new?overlay=true&type_name='+node.name+'" rel="#overlay"><img alt="new" src="images/new.png"/></a></div>';
			}
			
			document.getElementById('right-container').innerHTML = html;
			getPage("tag_instances?type_name="+node.name, test);
        },
        
        onAfterCompute: function(){
            Log.write("done");
			//http://localhost:3000/tag/tag_instances?type_name=Tag
        },
        
        //This method is called on DOM label creation.
        //Use this method to add event handlers and styles to
        //your node.
        onCreateLabel: function(label, node){
            label.id = node.id;            
            label.innerHTML = node.name;
			label.onclick = function(){
				st.onClick(node.id);
			};
            //set label styles
            var style = label.style;
            style.width = 60 + 'px';
            style.height = 17 + 'px';            
            style.cursor = 'pointer';
            style.color = '#333';
            style.fontSize = '0.8em';
            style.textAlign= 'center';
            style.paddingTop = '3px';
        },
        
        //This method is called right before plotting
        //a node. It's useful for changing an individual node
        //style properties before plotting it.
        //The data properties prefixed with a dollar
        //sign will override the global node style properties.
        onBeforePlotNode: function(node){
            //add some color to the nodes in the path between the
            //root node and the selected node.
            if (node.selected) {
                node.data.$color = "#ff7";
            }
            else {
                delete node.data.$color;
                var GUtil = $jit.Graph.Util;
                //if the node belongs to the last plotted level
                if(!GUtil.anySubnode(node, "exist")) {
                    //count children number
                    var count = 0;
                    GUtil.eachSubnode(node, function(n) { count++; });
                    //assign a node color based on
                    //how many children it has
                    node.data.$color = ['#aaa', '#baa', '#caa', '#daa', '#eaa', '#faa'][count];                    
                }
            }
        },
        
        //This method is called right before plotting
        //an edge. It's useful for changing an individual edge
        //style properties before plotting it.
        //Edge data proprties prefixed with a dollar sign will
        //override the Edge global style properties.
        onBeforePlotLine: function(adj){
            if (adj.nodeFrom.selected && adj.nodeTo.selected) {
                adj.data.$color = "#eed";
                adj.data.$lineWidth = 3;
            }
            else {
                delete adj.data.$color;
                delete adj.data.$lineWidth;
            }
        }
    });
	//turn string to json
	json = eval('(' + json + ')');
    //load json data
    st.loadJSON(json);
    //compute node positions and layout
    st.compute();
    //optional: make a translation of the tree
    //st.geom.translate(new $jit.Complex(-200, 0), "startPos");
    //emulate a click on the root node.
    st.onClick(st.root);
    //end
    //Add event handlers to switch spacetree orientation.
    /*
    var top = get('r-top'), 
    left = get('r-left'), 
    bottom = get('r-bottom'), 
    right = get('r-right');
    
    function changeHandler() {
        if(this.checked) {
            top.disabled = bottom.disabled = right.disabled = left.disabled = true;
            st.switchPosition(this.value, "animate", {
                onComplete: function(){
                    top.disabled = bottom.disabled = right.disabled = left.disabled = false;
                }
            });
        }
    };
    
    top.onchange = left.onchange = bottom.onchange = right.onchange = changeHandler;
    */
    //end
}
function init(tag){
	
    getJSON("tree?tag_name="+tag, callback);
}

function test(text) {
	document.getElementById('right-container').innerHTML += text;
}

function getPage(url, callback) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', url, true);
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 3) {
		
		}
		if (xmlhttp.readyState == 4) {
			callback(xmlhttp.responseText);
		}
	}
	xmlhttp.send(null);
}

function getJSON(url, callback) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', url, true);
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 3) {
		
		}
		if (xmlhttp.readyState == 4) {
			callback(xmlhttp.responseText);
		}
	}
	xmlhttp.send(null);
}
