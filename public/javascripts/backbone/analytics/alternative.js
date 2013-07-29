/*global App, Backbone,_,jQuery,JST*/	
App.module("main.analytics",function(that,App,Backbone,Marionette,jQuery,_,customArgs){

  this.Views.Alternative = Backbone.Marionette.CompositeView.extend({
      template: JST['analytics/alternative'],
      itemViewContainer: 'div#items',
      events : {
//        'click tr#projects td#projectA div.projectName'  : 'onProjectAclicked',
//        'click tr#projects td#projectB div.projectName'  : 'onProjectBclicked'
      },
    initialize : function( options ) {
      this.direction = options.direction;
      this.itemView = App.main.navigate.Views.ListItem;
      this.itemViewOptions = {
        context: this.context
      };
      
      this.on('show',this.onShow,this);
      
      this.myD3nodes = options.D3nodes;
      this.myD3nodes.on("nodesAttrChanged", this.refreshNodes, this);
      
  	  this.issueIndex = options.issueIndex;
  	  this.alternativeIndex = options.alternativeIndex;
  	  this.issueName = this.myD3nodes.getIssueName(this.issueIndex);
  	  this.alternativeName= this.myD3nodes.getAlternativeName(this.issueIndex, this.alternativeIndex)
  	  nodes = this.myD3nodes.getNodes(this.issueIndex, this.alternativeIndex);
      

	 this.arc = new d3.svg.arc()
	     .outerRadius(2) //function(d) { return (d.data.value)*2})
	     .innerRadius(0);
	 
	 this.force = new d3.layout.force();
	 
	 this.force
	 	 .links([])
	 	 .gravity(0)
	 	 .charge(-80);
	
	 this.force.on("tick", function(q) {
		var foci = [{x: 200, y: 300},{x: 1100, y: 300}, {x: 700, y: 300}];
		var decisionsColors = {null: 'blue', 'Positive': 'green',  'Negative': 'red', 'Open' : 'yellow'};
//	     Push nodes toward their designated focus.
	  	var k = .1 * q.alpha;
	  	nodes.forEach(function(o, i) {
	  		o.y += (foci[o.id].y - o.y) * k;
	      	o.x += (foci[o.id].x - o.x) * k;
	  	});
	  	 	
	   	d3.select('svg').selectAll('.node')
	   		.attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')'; })
	   		.attr('fill', function(d) {return decisionsColors[d.decision]; });	
	   	d3.select('svg').selectAll(".node").selectAll("path")
			.attr('transform', function(d) {return 'scale('+d.data.value*2+')'})
	   		.attr('fill', function(d) {return decisionsColors[d.decision]; });	
		   		
     });
     
     
      _(this).bindAll();      
      
    },   
	
		
	refreshNodes : function (){
		
		nodes = this.myD3nodes.getNodes(this.issueIndex, this.alternativeIndex);
		var pie = d3.layout.pie()
		    .sort(null)
		    .value(function(d) { return d.value; });
		
		this.force
			.nodes(nodes);
		this.force.start();	
		
		d3.select('svg').selectAll(".node")
		    .data(nodes)
		  .enter().append("g")
		   .attr("class", "node")
		   .call(this.force.drag)
		   .on("mouseover", function(d) {
		   		d3.select('.tooltip') 								// changing tooltip opacity and text
		   			.transition()        
		   		    .duration(200)      
		   		    .style("opacity", .9)
		   		d3.select('.tooltip').html('Decision: '+ d.decision + '<br/> Author:'+ d.author )  
		   		    .style("left", (d3.event.pageX) + "px")     
		   		    .style("top", (d3.event.pageY - 28) + "px"); 	   		
		   })
		   .on("mouseout", function(d) {
		   		d3.select('.tooltip')
		   			.transition()        
		   		    .duration(500)      
		   		    .style("opacity", 0) 	   		
		   });
		   

		d3.select('svg').selectAll(".node").selectAll("path")
		  .data(function(d) {return pie(d.pie); })
		 .enter().append("svg:path")
		  .attr("d", this.arc)		  

		d3.select('svg').selectAll('.node').data(nodes).exit().remove();

	    this.force.start();	
	},

    onRender : function(){

//      _(this.projects).each( function( project ){
//        var h = "<div class='projectName' id='" + project.get('id') +  "'>" + project.get('name') + "</div>";
//        jQuery('tr#projects td#projectA',this.el).append( h );
//        jQuery('tr#projects td#projectB',this.el).append( h );
//      },this);
//
//      this.itemsAview = new App.main.analytics.Views.List({context: this.context, collection: this.issuesA });
//      this.itemsAview.setElement( jQuery( 'tr#issues td#projectA',this.el));
//      this.itemsAview.render();
//
//      this.itemsBview = new App.main.analytics.Views.List({context: this.context, collection: this.issuesB });
//      this.itemsBview.setElement( jQuery( 'tr#issues td#projectB',this.el));
//      this.itemsBview.render();
//      this.delegateEvents();    

  	
    },
    
    onShow : function() {
    	d3.select('.ProjectA').text(this.myD3nodes.getProjectAname());
    	d3.select('.ProjectB').text(this.myD3nodes.getProjectBname());
    	d3.select('.issuename').text(this.issueName);
    	d3.select('.alternativename').text(this.alternativeName);
    	this.refreshNodes();
    },
        
//    
//    onProjectAclicked : function( e ){
//      jQuery('tr#projects td#projectA div.projectName').removeClass('red');  
//      jQuery( e.target ).addClass('red');
//      
//      this.projectA.set('id',e.target.id);
//      this.projectA.fetch();
//   	  
//   	     
//    },
//    
//    onProjectBclicked : function( e ){
//      jQuery('tr#projects td#projectB div.projectName').removeClass('red');
//      jQuery( e.target ).addClass('red');
//
//      this.projectB.set('id',e.target.id);
//      this.projectB.fetch();
//      
//    }
    
  });
});