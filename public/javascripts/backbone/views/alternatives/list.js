

AlternativeView  = Backbone.View.extend({
    events : {
		"keypress .name" : "editedName",
    },
    initialize: function() {
    },
    
    render: function() {

	   this.el.innerHTML = JST.alternatives_show( {a: this.model} );
	   return this;
    },
    // this updates single row in the table
    update: function( item_id ){
    		
    },
	editedName : function() {
		// nasty but works.
	    var lastEditedItem = this;

	  	jQuery(this.el).stopTime("edit5");
	  	jQuery(this.el).oneTime(1000,"edit5", function() {
			if( lastEditedItem.model.isNew() ) {
				lastEditedItem.trigger("new");
			}
			lastEditedItem.model.save(
				{ name: jQuery(".name",this).html() },
				{ success : function( model, resp)  {
//					model.unbind( 'change' );
					model.parse( resp );
//					model.bind('change', lastEditedItem.render);
//					model.change();
					lastEditedItem.trigger('saved');
					lastEditedItem = null;
				}
			});	
		});
	},
});


var AlternativeUpdatingView = AlternativeView.extend({
  initialize : function(options) {
    this.render = _.bind(this.render, this); 
    this.model.bind('change', this.render);
  }
});


App.Views.Alternatives.List = Backbone.View.extend({
  events : {
//	"click .newItem" : "newItem"
  },
  initialize : function() {
	this.alternativesCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : AlternativeUpdatingView,
      childViewTagName     : 'tr'
    });
	this.render();
	notifier.register(this);
	this.collection.bind('refresh', this.newAlternative);
  },
 
  render : function() {
		this.rendered = true;
		this.alternativesCollectionView.el = jQuery('table.alternativeList', this.el);
		this.alternativesCollectionView.render();
		this.newAlternative();
  },
  notify : function( broadcasted_id ) {
//		alert( broadcasted_id);
		this.collection.each( function( i ) {	
			if( i.get('id') == broadcasted_id ) {
				i.fetch();
				i.change();
				this.newAlternative();
			}
		});
  },
  newAlternative : function() {
		if( this.collection.size() == 0 ||
		    this.collection.last().isNew() == false ) {
			a = new Alternative;
			a.set({name: 'new alternative'});
			this.collection.add( a );
//			a.bind('change', this.newAlternative );
		}
  },
});



