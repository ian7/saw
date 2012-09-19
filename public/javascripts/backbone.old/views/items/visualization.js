App.Views.Items.Visualization = Backbone.View.extend({
	events: {
			"click .toIndex" : "navigateToIndex",
			"click .toAlternatives" : "navigateToAlternatives",
			"click .toVisualization" : "navigateToVisualization",
			"click .toDetails" : "navigateToDetails",
	},
    initialize: function() {
		//this.tagCollection = new Tags;
		_(this).bindAll('render','navigateToAlternatives','navigateToVisualization','navigateToDetails');
		_.extend( this, App.Helpers.ItemNavigation );

//		this.el = el;
		notifier.register(this);

    },
	navigateToIndex : function() {
		window.location.href = window.location.href.match(".*#")	
	},
	navigateToDetails : function() {
		window.location.href = window.location.href.match(".*#")+'/'+this.model.id;
	},
	navigateToVisualization : function(){
		window.location.href = window.location.href.match(".*#")+'/'+this.model.id+'/visualization';
	},
	navigateToAlternatives : function(){
		window.location.href = window.location.href.match(".*#")+'/'+this.model.id+'/alternatives';			
	},    
    render: function() {

		this.renderNavigation();

		itemID = this.id;
		jQuery(this.el).append(JST.items_visualization({}));
		this.renderMetricsPicker();
		
		postRenderInit();		
		
		init(this.id);

	   startHeatMap();
	   renderGraph();

		return( this );
		// alternatives list

    },
	navigateToIndex : function() {
		window.location.href = window.location.href.match(".*#")	
	},
	renderMetricsPicker: function() {
		jQuery.getJSON("/metrics/list", function(data){
		  var code = "<table><tr> <td><font color='white'>Metric</font></td> <td><font color='white'>Red</font></td> <td><font color='white'>Green</font></td> <td><font color='white'>Blue</font></td></tr>";
		  code += "<tr>";
		  for(var i = 0; i < data.length; i++){
		    code += "<td><font color='white'>" + data[i] + " </font></td> ";
		    code += "<td><input type='radio' name='red' value='red_"+data[i]+"' onclick='manageMetricsButton(\"red_"+data[i]+"\")'></td>";
		    code += "<td><input type='radio' name='green' value='green_"+data[i]+"' onclick='manageMetricsButton(\"green_"+data[i]+"\")'></td>";
		    code += "<td><input type='radio' name='blue' value='blue_"+data[i]+"' onclick='manageMetricsButton(\"blue_"+data[i]+"\")'></td></tr>";
		  }

		  code += "<td><font color='white'>Nothing</font></td> ";
		  code += "<td><input type='radio' name='red' value='red_nothing' onclick='manageMetricsButton(\"red_nothing\")' checked></td>";
		  code += "<td><input type='radio' name='green' value='green_nothing' onclick='manageMetricsButton(\"green_nothing\")' checked></td>";
		  code += "<td><input type='radio' name='blue' value='blue_nothing' onclick='manageMetricsButton(\"blue_nothing\")' checked></td></tr>";

		  code += "</table>";
		  jQuery('#metricsPicker').html(code);
		});
	}
});
