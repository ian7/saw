/*global App, Backbone,_,jQuery,JST*/	
var nodes = [];

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
        item: this.projectA,
        direction: 'from',
      });

      this.issuesA = new App.Data.FilteredCollection( null, {
        collection: this.relatedToA ,
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
        filter : function( item ){
          return( item.get('type') === 'Issue');
        }
      })


	 var foci = [{x: 200, y: 400},{x: 1200, y: 400}, {x: 700, y: 400}];
	 this.force = new d3.layout.force();
	 this.force.on("tick", function(q) {

	    // Push nodes toward their designated focus.
	  	var k = .1 * q.alpha;
	  	nodes.forEach(function(o, i) {
	  		o.y += (foci[o.id].y - o.y) * k;
	      	o.x += (foci[o.id].x - o.x) * k;
	  	});
	  
	  	d3.select('svg').selectAll("circle.node")
	   		.attr("cx", function(d) { return d.x; })
	   		.attr("cy", function(d) { return d.y; })
	   		.attr("id", function(d) { return d.id; })
	   		.style("fill", function(d) {return d.fill; });
		   		
     });
	///----------------<-------------
	 this.issuesA.on("add", this.onIssueAAdded, this);
	 this.issuesA.on("remove", this.onIssueARemoved, this);
	 this.issuesB.on("remove", this.onIssueBRemoved, this);	 
	 this.issuesB.on("add", this.onIssueBAdded, this);	 
	 
      this.hasSVG = false;
      _(this).bindAll();      
      
    },   
	
	onIssueARemoved : function(delissue) {
//		console.log(delissue);
		for(var i in nodes){
			if (nodes[i].saw_id == delissue.id){
				if (nodes[i].id == 2) {
					nodes[i].fill = 'red';
					nodes[i].id = 1;
					break;
				}
				else {
					nodes.splice(i,1);
					break;
				}
			}
		};
		d3.selectAll('.node').data(nodes).exit().remove();
		this.force.start();
	},
	
	onIssueBRemoved : function(delissue) {
//		console.log(delissue);
		for(var i in nodes){
			if (nodes[i].saw_id == delissue.id){
				if (nodes[i].id == 2) {
					nodes[i].fill = 'blue';
					nodes[i].id = 0;
					break;
				}
				else {
					nodes.splice(i,1);
					break;
				}
			}
		};
		d3.selectAll('.node').data(nodes).exit().remove();
		this.force.start();
	},	

	
	onIssueAAdded : function(newissue) {
// 		console.log(newissue.id);	
	 	var not_added = true;
	 	for (var i in nodes){
	 		if (nodes[i].saw_id == newissue.id){
	 			nodes[i].id = 2;
	 			nodes[i].fill = 'yellow';
//	 			nodes.push({id: 2, x:700, y:100, name: newissue.get('name'), saw_id: newissue.id});		
	 			not_added = false;
	 		}
	 	};
	 	if ( not_added) {
	 		nodes.push({id: 0, x:200, y:100, name: newissue.get('name'), saw_id: newissue.id, fill: 'blue'});
 		};
 		
	 	this.force
	 		.nodes(nodes)
	 		.links([])
	 		.gravity(0);
 	
	 	
//	 	this.force.start();
	 	
	 	d3.select('svg').selectAll("circle.node")
	 	    .data(nodes)
	 	  .enter().append("svg:circle")
	 	    .attr("class", "node")
	 	    .attr("cx", function(d) { return d.x; })
	 	    .attr("cy", function(d) { return d.y; })
	 	    .attr("r", 8)
   	 	    .attr("id", function(d) { return d.id; })
	 	    .style("fill", function(d) { return d.fill; })
	 	    .style("stroke", "black")
	 	    .style("stroke-width", 1.5)
	 	
	 	this.force.start();
	},
	
	onIssueBAdded : function(newissue) {
// 		console.log(newissue.get('name'));	
	 	var not_added = true;
	 	for (var i in nodes){
	 		if (nodes[i].saw_id == newissue.id){
	 			nodes[i].id = 2;
	 			nodes[i].fill = 'yellow';
//	 			nodes.push({id: 2, x:700, y:100, name: newissue.get('name'), saw_id: newissue.id});		
	 			not_added = false;
	 		}
	 	};
	 	if ( not_added) {
	 		nodes.push({id: 1, x:1200, y:100, name: newissue.get('name'), saw_id: newissue.id, fill: 'red'});
	 		
	 	};
	 	
	 	
	 	this.force
	 		.nodes(nodes)
	 		.links([])
	 		.gravity(0);
 	
	 	
//	 	this.force.start();
	 	
	 	d3.select('svg').selectAll("circle.node")
	 	    .data(nodes)
	 	  .enter().append("svg:circle")
	 	    .attr("class", "node")
	 	    .attr("cx", function(d) { return d.x; })
	 	    .attr("cy", function(d) { return d.y; })
	 	    .attr("r", 8)
	 	    .attr("id", function(d) { return d.id; })
	 	    .style("fill", function(d) { return d.fill; })
	 	    .style("stroke", "black")
	 	    .style("stroke-width", 1.5)
	 	
	 	this.force.start();
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
		d3.select("#mysvg").append("svg")
			.attr("width", 1500)
			.attr("height", 800);
		d3.select('svg').append('svg:rect')
			.attr('x', 150)
			.attr('y', 5)
			.attr('width', 1100)
			.attr('height',30)
			.attr('opacity', 0.1)  
		d3.select('svg').append('svg:circle')
			.attr('cx', 200)
			.attr('cy', 20)
			.attr('r', 8)
			.attr('class', 'info')
			.style('fill', 'blue')
		d3.select('svg').append("svg:text")
			.attr('x', 220)
			.attr('y', 20)
			.text('project A')
		d3.select('svg').append('svg:circle')
			.attr('cx', 700)
			.attr('cy', 20)
			.attr('r', 8)
			.attr('class', 'info')
			.style('fill', 'yellow')
		d3.select('svg').append("svg:text")
			.attr('x', 720)
			.attr('y', 20)
			.text('common issues')
		d3.select('svg').append('svg:circle')
			.attr('cx', 1100)
			.attr('cy', 20)
			.attr('r', 8)
			.attr('class', 'info')
			.style('fill', 'red')
		d3.select('svg').append("svg:text")
			.attr('x', 1120)
			.attr('y', 20)
			.text('project B')
		this.hasSVG = true;
		nodes = [];
      	d3.selectAll('.node').remove();
      }
      
    },
    
    onProjectBclicked : function( e ){
      jQuery('tr#projects td#projectB div.projectName').removeClass('red');
      jQuery( e.target ).addClass('red');

      this.projectB.set('id',e.target.id);
      this.projectB.fetch();
      
      if (!this.hasSVG){
      	d3.select("#mysvg").append("svg")
      	.attr("width", 1500)
      	.attr("height", 800);
      	this.hasSVG = true;
      	nodes = [];
      	d3.selectAll('.node').remove();
      };
    }
    
  });
});