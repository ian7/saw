/*global App, Backbone,_,jQuery,JST*/	
App.module("main.analytics",function(that,App,Backbone,Marionette,jQuery,_,customArgs){

  this.Views.Index = Backbone.Marionette.CompositeView.extend({
      template: JST['analytics/index'],
      itemViewContainer: 'div#items',
      events : {
        'click tr#projects td#projectA div.projectName'  : 'onProjectAclicked',
        'click tr#projects td#projectB div.projectName'  : 'onProjectBclicked'
      },
    initialize : function( options ) {
      this.direction = options.direction;
      this.itemView = App.main.navigate.Views.ListItem;
      this.itemViewOptions = {
        context: this.context
      };

      this.projects = App.main.context.tags.filter( function( tag ){ return( tag.get('type')==='Project');} );

      this.projectA = new App.Data.Item();
      this.projectB = new App.Data.Item();

      this.relatedToA = new App.Data.RelatedCollection(null,{
        item: this.projectA ,
        direction: 'from',
      });
    
	  
      this.issuesA = new App.Data.FilteredCollection( null, {
        collection: this.relatedToA ,
        model: App.Models.Issue,
        modelOptions : {
        	project: this.projectA
        },
        filter : function( item ){
          return( item.get('type') === 'Issue');
        }
      })


      this.relatedToB = new App.Data.RelatedCollection(null,{
        item: this.projectB,
        direction: 'from'
      });

      this.issuesB = new App.Data.FilteredCollection( null, {
        collection: this.relatedToB ,
        model: App.Models.Issue,
        modelOptions : {
        	project: this.projectB
        },
        filter : function( item ){
          return( item.get('type') === 'Issue');
        }
      })
	 
	 
	 this.hasSVG = false;
	 selectedNode = null;
	 this.Nodes = [];
	 
	 
	 this.myD3nodes = new App.Data.D3nodes(this.issuesA, this.issuesB);
	 this.myD3nodes.on("nodesChanged",this.refreshNodes, this);
	 this.myD3nodes.on("nodesAttrChanged", this.refreshNodesAttr, this);
	 
	 
	 
	 
	 this.force = new d3.layout.force();
	 
	 this.force
		 .links([])
		 .gravity(0)
		 .charge(-80)
	 
	 this.arc = new d3.svg.arc()
	     .outerRadius(2) //function(d) { return (d.data.value)*2})
	     .innerRadius(0);
		
	 this.force.on("tick", function(q) {

		var foci = [{x: 200, y: 300},{x: 1100, y: 300}, {x: 700, y: 300}];
		var decisionsColors = {null: 'brown', 'No decisions were made yet': 'red',  'Some decisions are missing': 'grey', 'Decisions are not conclusive (multiple positive)' : 'green', 'Decided': 'blue'};

//	     Push nodes toward their designated focus.
	  	var k = .1 * q.alpha;
	  	nodes.forEach(function(o, i) {
	  		o.y += (foci[o.id].y - o.y) * k;
	      	o.x += (foci[o.id].x - o.x) * k;
	  	});

	   	d3.select('svg').selectAll('.node')
	   		.attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')'; });
	   	d3.select('svg').selectAll(".node").selectAll("path")
			.attr('transform', function(d) {return 'scale('+d.data.value*2+')'})
	   		.attr('fill', function(d) {return decisionsColors[d.data.decision]; });	
		   		
     });

 	 
     _(this).bindAll();      
// 	 _.bind(this.onTick,this);
      
    },   
    
//    onTick : function(q) {
//        Push nodes toward their designated focus.
//		console.log(q.aplha);
//        var foci = [{x: 200, y: 300},{x: 1100, y: 300}, {x: 700, y: 300}];
//        var decisionsColors = {null: 'white', 'No decisions were made yet': 'red',  'Some decisions are missing': 'grey', 'Decisions are not conclusive (multiple positive)' : 'green', 'Decided': 'blue'};
//     	var k = .1 * q.alpha;
//     	if (this.Nodes) {
//	     	this.Nodes.forEach(function(o, i) {
//	     		o.y += (foci[o.id].y - o.y) * k;
//	         	o.x += (foci[o.id].x - o.x) * k;
//	     	});
//     	}
//      	d3.select('svg').selectAll('.node')
//      		.attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')'; });
//      	d3.select('svg').selectAll(".node").selectAll("path")
//    		.attr('transform', function(d) {return 'scale('+(d.data.value*1.7)+')'})
//      		.attr('fill', function(d) {return decisionsColors[d.data.decision]; });	
//    	   		
//    },
//    
	
	drawSvg : function () {
	
	this.hasSVG = true;	
	d3.select("#mysvg").append("svg")
		.attr("width", 1600)
		.attr("height", 600);
	d3.select('svg').append('svg:rect')
		.attr('x', 1)
		.attr('y', 1)
		.attr('width', 1598)
		.attr('height',598)
		.attr('opacity', 1)
		.style('fill', 'white')
		.style('stroke', 'black')
		.style('stroke-width', 2)
		.style('stroke-opacity', 1)  	
	d3.select('svg').append('svg:rect')  // upper line
		.attr('x', 0)
		.attr('y', 0)
		.attr('width', 1600)
		.attr('height',30)
		.attr('opacity', 0.1)  
	d3.select('svg').append("svg:text")
		.attr('x', 200)
		.attr('y', 20)
		.text('project A')
	d3.select('svg').append("svg:text")
		.attr('x', 650)
		.attr('y', 20)
		.text('common issues')
	d3.select('svg').append("svg:text")
		.attr('x', 1050)
		.attr('y', 20)
		.text('project B')
	d3.select('svg').append("svg:text")
		.attr('x', 1350)
		.attr('y', 180)
		.attr('class', 'issuename')
		//.text('Name')
	
	d3.selectAll('.node').remove();
	
	
	d3.select("#mysvg").append("div")   
	    .attr("class", "tooltip")               
	    .style("opacity", 0);
	
	},
	
	changeView : function(k) {
	
		console.log(k.index);
		selectedNode = k;
		this.context.dispatch('analyze:issue',k.index)
	},
	
	refreshNodes : function (k){
		nodes = this.myD3nodes.getNodes();
//		if(selectedNode != null) {console.log(selectedNode);}
		
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
		   .call(this.force.drag)    // enables drag and drop for nodes
		   .on("mouseover", function(d) {
		   		d3.select('svg').select(".issuename").text(d.name)	// changing right column description	   		
		   })
		   .on("mouseout", function(d) {
		   		d3.select('svg').select(".issuename").text("")		   		
		   })
		   .on('click', this.changeView );

		   
		   


		d3.select('svg').selectAll(".node").selectAll("path")
		  .data(function(d) {return pie(d.pie); })
		 .enter().append("svg:path")
		  .attr("d", this.arc)		  
		  .on("mouseover", function(d) {
		  		d3.select('.tooltip') 								// changing tooltip opacity and text
		  			.transition()        
		  		    .duration(200)      
		  		    .style("opacity", .9)
		  		d3.select('.tooltip').html(d.data.decision + "<br/> Radius:"+(d.data.value-1))  
		  		    .style("left", (d3.event.pageX) + "px")     
		  		    .style("top", (d3.event.pageY - 28) + "px"); 	   		
		  })
		  .on("mouseout", function(d) {
		  		d3.select('.tooltip')
		  			.transition()        
		  		    .duration(500)      
		  		    .style("opacity", 0) 	   		
		  });

		d3.selectAll('.node').data(nodes).exit().remove();

	    this.force.start();	
	},
	
	refreshNodesAttr : function() {
		
		nodes = this.myD3nodes.getNodes();
//		console.log(nodes)
		this.force
			.nodes(nodes);
		this.force.tick();	
	
	},
	

    onRender : function(){

      _(this.projects).each( function( project ){
        var h = "<div class='projectName' id='" + project.get('id') +  "'>" + project.get('name') + "</div>";
        jQuery('tr#projects td#projectA',this.el).append( h );
        jQuery('tr#projects td#projectB',this.el).append( h );
      },this);

      this.itemsAview = new App.main.analytics.Views.List({context: this.context, collection: this.issuesA });
      this.itemsAview.setElement( jQuery( 'tr#issues td#projectA',this.el));
      this.itemsAview.render();

      this.itemsBview = new App.main.analytics.Views.List({context: this.context, collection: this.issuesB });
      this.itemsBview.setElement( jQuery( 'tr#issues td#projectB',this.el));
      this.itemsBview.render();
      this.delegateEvents();        
    },
    
    onProjectAclicked : function( e ){
      jQuery('tr#projects td#projectA div.projectName').removeClass('red');  
      jQuery( e.target ).addClass('red');
      
      this.projectA.set('id',e.target.id);
      this.projectA.fetch();
      
      if (!this.hasSVG){
      	this.drawSvg();
	    
	  }
      
    },
    
    onProjectBclicked : function( e ){
      jQuery('tr#projects td#projectB div.projectName').removeClass('red');
      jQuery( e.target ).addClass('red');

      this.projectB.set('id',e.target.id);
      this.projectB.fetch();
      
      if (!this.hasSVG){
      	this.drawSvg();
      };
    }
    
  });
});