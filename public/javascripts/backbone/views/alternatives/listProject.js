

AlternativeProjectUpdatingView  = Backbone.View.extend({
	className : "alternativeList", 
    events : {
    },
    initialize: function() {
	    this.model.bind('change', this.render);
		_(this).bindAll('render','notify');
		
		notifier.register(this);
    },
    
    render: function() {
		model = this.model;
		view = this;

		//really odd...
		if( !this.model ) {
			model = this.view.model;
			view = this.view;
		}

	   view.el.innerHTML = JST.alternatives_showProject( {a: model} );	    
	   
	   // this is not a nice place to do that, but what the heck...
	
	  if( model.isDecided() )
	   jQuery(view.el).removeClass().addClass("decision").addClass(model.decision().color.toLowerCase());

		
	
	   return this;
    },
	notify : function( broadcasted_id ) {
		if( this.model.id == broadcasted_id ) {
			this.model.fetch();
			jQuery(this.el).effect("highlight", {}, 500);	
		}
	},
});



App.Views.Alternatives.ListProject = Backbone.View.extend({
  events : {
//	"click .newItem" : "newItem"
  },
  initialize : function() {
	this.alternativesCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : AlternativeProjectUpdatingView,
      childViewTagName     : 'tr',
      childViewClassName   : 'decision',
    });
	this.render();
	notifier.register(this);

//	this.collection.bind('refresh', this.checkNewAlternative);
  },
 
  render : function() {
		this.rendered = true;
		this.alternativesCollectionView.el = jQuery('table.alternativeList', this.el);
		this.alternativesCollectionView.el.innerHTML="";
		this.alternativesCollectionView.render();
  },
  notify : function( broadcasted_id ) {
		this.collection.each( function( i ) {	
/*			if( i.get('id') == broadcasted_id ) {
				i.fetch();
				i.change();
			}
			*/
		});
  },
});



