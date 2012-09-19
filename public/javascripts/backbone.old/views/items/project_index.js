/**
 * @author Marcin Nowak
 */

App.Views.Items.ProjectItem = Backbone.View.extend({
  events : {
		'click .showDetails' : 	'showDetails',
	},

  alternativesCollection : null,

  initialize : function(options) {

	_(this).bindAll('render','alternativesReady','notify');
	this.alternativesCollection = new Alternatives;
	
	this.alternativesCollection.issueView = this;
	// catch alternatives resource location hack
	this.alternativesCollection.item_url = this.model.url();
	this.alternativesCollection.url = this.model.url()+'/alternatives';

	this.alternativesCollection.bind('refresh',this.alternativesReady);
	
	// relate alternatives set to the model
	this.model.alternatives = this.alternativesCollection;

    this.render = _.bind(this.render, this); 
    this.model.bind('change', this.render);

	this.isExpanded = false;

	
	this.alternativesCollectionView = new App.Views.Alternatives.ListProject({ collection: this.alternativesCollection, el: this.el });
	_(this).bindAll('notify');
		
	notifier.register( this );
	this.alternativesCollection.fetch();
  },
  addStatus : function( message ) {
			jQuery("ul.status",this.el).append("<li>"+ message+"</li>");
  },
  alternativesReady : function() {
	this.render();
  },
  render : function() {

   this.el.innerHTML = JST.project_show( {item: this.model} );
   this.alternativesCollectionView.render();
/* debug
   jQuery(this.el).prepend("<div class = 'button red render'>Render!</div>");
   jQuery(this.el).prepend("<div class = 'button red fetch'>Fetch!</div>");
*/
//	if( this.alternativesCollection.length == 0 )
//		this.addStatus("no alternatives")
//	this.addStatus( this.model.decisionState() );

   return this;
  },
	showDetails : function() {
		window.location.href = window.location.href+'/items#/'+this.model.id+'/details';
		
	},
  notify : function( broadcasted_id ) {
		if( this.model.get('id') == broadcasted_id ) {

			this.model.fetch();
			
			// deep refresh is required here to get decision arrays updated
			this.alternativesCollection.fetch({deepRefresh: true});
			jQuery(this.el).effect("highlight", {}, 500);	

		}
  }  

});

App.Views.LifeProjectAlternative = Backbone.Marionette.CompositeView.extend({
	//template: '#LifeProjectAlternativeTemplate',
	tagName: 'tr',
	className: 'decision',
	initialize : function(){
		_(this).bindAll();
		this.model.on('change',this.render,this);
		eventer.register(this);
	},
	render : function(){
		h = ""
		h +="<tr>"
		h +="<td class='decisionType'>"
		h +="		<!-- D: " + this.model.decisionsTotal() + " -->"
		
		var color = "white";

		if( this.model.isDecided() ) { 
			h += this.model.decision().name;
			color = this.model.decision().color.toLowerCase();
		}
		if( this.model.isColliding() ) {
			h += "Colliding !";
			color = "gray";
		} 
				
		h += "</td>";
		h += "<td class = 'name'>";
	    h += "<span class='name'>" 

	    if( this.model.get('name') ) {
	    	h += this.model.get('name');
	    }
	    else{
	    	h += "(empty)";
	    }
	    h += "</span></td>";
		h +="</tr>";
		jQuery(this.el).html( h );
	   jQuery(this.el).removeClass().addClass("decision").addClass(color);

	},
	notifyEvent : function( data ){
	  	d = JSON.parse(data)

	  	if( d.id == this.model.get('id')  && d.event.match('mouse') == null){
//	  		debugger
//	  		this.model.clear({silent:true});
//			this.model.fetch();
	  	}
	},

});

App.Views.LifeProjectIssue = Backbone.Marionette.CompositeView.extend({
	template: '#LifeProjectIssueTemplate',
	tagName: 'tr',
	className: 'LifeProjectIssue',
	itemView: App.Views.LifeProjectAlternative,
	initialize: function(){

		// general bindings
		_(this).bindAll();
		this.collection = new Alternatives();
		this.collection.url = this.model.url() + '/alternatives';
	  	this.collection.comparator = function( model ){ model.get('name').toLowerCase() }
		this.collection.fetch();

		//model likes to have alternatives
		this.model.alternatives = this.collection;

		// notifications
		this.model.on('change',this.onRender,this);
		this.collection.on('reset',this.onRender,this);
		eventer.register(this);
	},
  	appendHtml: function(collectionView, itemView, index){
  		jQuery("table.alternativesList",collectionView.el).append(itemView.el);
  	},
  	onRender : function(){
  		jQuery("span.name",this.el).eq(0).html(this.model.get('name'));
		var totalDecisions = 0;

		for( alternativeId in this.collection.models ) {
			var alternative = this.collection.models[alternativeId];
			if( alternative.attributes.decisions ) { 
				totalDecisions = totalDecisions + alternative.decisionsTotal();
			 } 
		}
  		jQuery("span.totalDecisions",this.el).html(totalDecisions);
  		jQuery("span.decisionState",this.el).html(this.model.decisionState());
  	},
  	notifyEvent : function( data ){
	  	d = JSON.parse(data)

	  	if( d.id == this.model.get('id') && d.event.match('mouse') == null){
  			//debugger
	  		if( d.distance == 0 ){
	  		}

	  		if( d.distance == 2 ){

	  		}
	  		this.collection.fetch();
	  	}

	  	if( d.id == this.model.get('id') && d.distance == 2 && d.event.match('mouse') == null){
	  		this.collection.reset(null,{silent:true});
			this.collection.fetch();
	  	}
	  	if( d.id == this.model.get('id') && d.distance == 0 && d.event.match('mouse') == null){
			this.model.fetch();
	  	}
	},
});

App.Views.LiveProjectReport = Backbone.Marionette.CompositeView.extend({
	itemView: App.Views.LifeProjectIssue,
	initialize : function(){
		_(this).bindAll();
	  	this.model = new Backbone.Model();
	  	this.model.url = '/projects/'+this.id;
	  	this.model.fetch()
	  	this.model.on('change',this.projectChanged,this);


	  	this.collection = new Items();
	  	this.collection.urlOverride = this.model.url + "/items";
	  	this.collection.comparator = function( model ){ 
	  		if( model.get('name') ){
	  			return model.get('name').toLowerCase() 
	  		}
	  		else{
	  			return null;
	  		}
	  	}
	  	this.collection.fetch();

	  	eventer.register(this)
	},
	render : function(){
		h = ""
		h += "<div class='header'>Project: <div id='projectName'>" + this.model.get('name')+"</div>";
		h += "<table class='issuesList'></table>";

		jQuery(this.el).html( h );
	},
	projectChanged : function(){
		jQuery("div#projectName",this.el).html(this.model.get('name'));
	},
	notifyEvent : function( data ){
	  	d = JSON.parse(data)

	  	if( d.id == this.model.get('id') &&
	  		d.distance == 0 &&
	  		d.event.match('mouse') == null){
			//this.collection.fetch();
	  	}
  	},
  	appendHtml: function(collectionView, itemView, index){
  	  jQuery("table.issuesList",collectionView.el).append(itemView.el);
  	},
});




