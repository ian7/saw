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

App.Views.Items.ProjectIndex = Backbone.View.extend({
  events : {
  },

  initialize : function() {


//	this.collection.bind('saved',this.checkNewItem );
//	this.collection.bind('refresh',this.checkNewItem );
	
	this.collection.comparator = function( m ) { return m.get('id'); };

    // simply magic :)
    if( window.location.pathname.match('projects') ) {
		this.projectid = window.location.pathname.match('projects\/.*$')[0].substring(9,33);
	}

	this._itemsCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : App.Views.Items.ProjectItem,
      childViewTagName     : 'p',
	  childViewClassName   : 'itemList'
    });



	this.render();
	notifier.register(this);

  },
 
  render : function() {			
		this._rendered = true;
		this._itemsCollectionView.el = this.el; 
		this._itemsCollectionView.render();
		
	//	jQuery(this.el).prepend("<div class = 'button orange collapseAll'>Collapse all</div>");
//		jQuery(this.el).prepend("<div class = 'button orange expandAll'>Expand all</div>");
//		jQuery(this.el).prepend("<div class = 'button red newItem'>New!</div>");
//		this.checkNewItem();
  },
  notify : function( broadcasted_id ) {
/*		this.collection.each( function( i ) {	
			if( i.get('id') == broadcasted_id ) {
				i.fetch({
					success: function(model,resp) {
						model.change();
						jQuery(model.view.el).effect("highlight", {}, 500);
					}
				});
			}
		});
*/
		var thisView = this;
		
		if( this.projectid == broadcasted_id ) {
			this.collection.fetch({
				success: function(model, resp){
//					thisView.colllection
//					thisView.render();
				}
			});
		}
		
  },
});


