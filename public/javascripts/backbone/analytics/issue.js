/*global App, Backbone,_,jQuery,JST*/	
App.module("main.analytics",function(that,App,Backbone,Marionette,jQuery,_,customArgs){

  this.Views.Issue = Backbone.Marionette.CompositeView.extend({
      template: JST['analytics/issue'],
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
      
      
  	  this.issueIndex = options.issueIndex;
  	  this.issueName = nodes[this.issueIndex].name;
  	  nodes = nodes[this.issueIndex].Alternatives;
      this.projectAname = options.projectAname;
	  this.projectBname = options.projectBname;
      
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
	 this.arc = new d3.svg.arc()
	     .outerRadius(2) //function(d) { return (d.data.value)*2})
	     .innerRadius(0);
	 
	 this.force2 = new d3.layout.force();
	 
	 this.force2
	 	 .links([])
	 	 .gravity(0)
	 	 .charge(-80);
	
	 this.force2.on("tick", function(q) {
		var foci = [{x: 200, y: 300},{x: 1100, y: 300}, {x: 700, y: 300}];
		var decisionsColors = {null: 'blue', 'Positive': 'green',  'Negative': 'red', 'Open' : 'yellow'};
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
     
     this.myD3nodes2 = new App.Data.D3nodes(this.issuesA, this.projectA, this.issuesB, this.projectB);
     this.myD3nodes2.on("nodesaAttrChanged",this.updateData, this);
 	 
      this.hasSVG = false;
      _(this).bindAll();      
      
    },   
	
	updateData : function (){
		
		var temp = this.myD3nodes2.getNodes();
		nodes = temp[this.issueIndex].Alternatives;
		this.refreshNodes();
	},
	
	refreshNodes : function (){
		
		var pie = d3.layout.pie()
		    .sort(null)
		    .value(function(d) { return d.value; });
		
		this.force2
			.nodes(nodes);
		this.force2.start();	
		
		d3.select('svg').selectAll(".node")
		    .data(nodes)
		  .enter().append("g")
		   .attr("class", "node")
		   .call(this.force2.drag)
		   .on("mouseover", function(d) {
		   		d3.select('.tooltip') 								// changing tooltip opacity and text
		   			.transition()        
		   		    .duration(200)      
		   		    .style("opacity", .9)
		   		d3.select('.tooltip').html(d.name +'<br/> Dec A:'+ d.Decisions[1].decision + '<br/> Dec B:'+ d.Decisions[0].decision )  
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
		  .data(function(d) {return pie(d.Decisions); })
		 .enter().append("svg:path")
		  .attr("d", this.arc)		  

		d3.select('svg').selectAll('.node').data(nodes).exit().remove();

	    this.force2.start();	
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
    	d3.select('.ProjectA').text(this.projectAname);
    	d3.select('.ProjectB').text(this.projectBname);
    	d3.select('.issuename').text(this.issueName)
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