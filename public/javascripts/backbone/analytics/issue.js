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
 	  
 	  this.projectA = new App.Data.Item();
      
      if( options.projectAid){
      	this.projectAid = options.projectAid;
      	this.projectA.set('id',this.projectAid)
      	this.projectA.fetch();
      }
      
      
      this.projectB = new App.Data.Item();
	  
	  if (options.projectBid){
	  	this.projectBid = options.projectBid;
	  	this.projectB.set('id',this.projectBid)
	  	this.projectB.fetch();
	  }
	  	 
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

	 
	  this.myD3nodes = new App.Data.D3nodes(this.issuesA, this.issuesB, this.projectA, this.projectB);
      
      
      this.myD3nodes.on("nodesAttrChanged", this.refreshNodes, this);
      this.myD3nodes.on("nodesChanged", this.refreshNodes, this);
  	  
//  	  this.issueName = this.myD3nodes.getIssueName(this.issueIndex);
  	  
//  	  nodes = this.myD3nodes.getNodes(this.issueIndex);
      

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
	   		.attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')'; });
	   	d3.select('svg').selectAll(".node").selectAll("path")
			.attr('transform', function(d) {return 'scale('+d.data.value*2+')'})
	   		.attr('fill', function(d) {return decisionsColors[d.data.decision]; });	
		   		
     });
     
     
      _(this).bindAll();      
      
    },   
	
	
	changeView : function(alternative) {
//		console.log(alternative);
		this.force.stop();
		this.context.dispatch('analyze:alternative',{projectAid: this.projectAid, projectBid : this.projectBid, issueIndex : this.issueIndex, alternativeIndex : alternative.index} )
	},
	
	refreshNodes : function (){
		
		nodes = this.myD3nodes.getNodes(this.issueIndex);
		var pie = d3.layout.pie()
		    .sort(null)
		    .value(function(d) { return d.value; });
		
		
		d3.select('.issuename').text(this.myD3nodes.getIssueName(this.issueIndex));
		
		
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
		   		d3.select('.tooltip').html(d.name +'<br/> Dec A:'+ d.pie[1].decision + '<br/> Dec B:'+ d.pie[0].decision )  
		   		    .style("left", (d3.event.pageX) + "px")     
		   		    .style("top", (d3.event.pageY - 28) + "px"); 	   		
		   })
		   .on("mouseout", function(d) {
		   		d3.select('.tooltip')
		   			.transition()        
		   		    .duration(500)      
		   		    .style("opacity", 0) 	   		
		   })
		   .on('click', this.changeView );
		   

		d3.select('svg').selectAll(".node").selectAll("path")
		  .data(function(d) {return pie(d.pie); })
		 .enter().append("svg:path")
		  .attr("d", this.arc)		  

		d3.select('svg').selectAll('.node').data(nodes).exit().remove();

	    this.force.start();	
	},

    onRender : function(){
  
		this.context.dispatchGlobally("history:push", this.serializeIssue(this.issueIndex) );
  	
    },
    
    onShow : function() {
    	d3.select('.ProjectA').text(this.myD3nodes.getProjectAname());
    	d3.select('.ProjectB').text(this.myD3nodes.getProjectBname());
    	
//    	this.refreshNodes();
    },
    
    
    serializeIssue : function (issueIndex) {
    	var v = {dialog: 'main.analytics.issue'}
    	if (this.projectAid) {
        	v = {
        		dialog : 'main.analytics.issue',
        		projectAid : this.projectA.id,
        		issueIndex : issueIndex
        	}
        }
        if (this.projectAid && this.projectBid) {
        	v = {
        		dialog : 'main.analytics.issue',
        		projectAid : this.projectA.id,
        		projectBid : this.projectB.id,
        		issueIndex : issueIndex        
        	}
        }
        else if (this.projectBid) {
        	v = {
        		dialog : 'main.analytics.issue',
        		projectBid : this.projectB.id,
        		issueIndex : issueIndex        		
        	}
        }
    	return v;
    }
    
        
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