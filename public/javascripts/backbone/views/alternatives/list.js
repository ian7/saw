

AlternativeView  = Backbone.View.extend({
    events : {
		"keypress .name" 			: "editedName",
		"click .deleteAlternative"	: "deleteAlternative",
		"click .unrelateAlternative": "unrelateAlternative",
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
		//	if( lastEditedItem.model.isNew() ) {
		//		lastEditedItem.trigger("new");
		//	}
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
	deleteAlternative : function(){
		this.model.destroy();
    },
	unrelateAlternative : function() {
		;
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
	this.collection.bind('saved', this.newAlternative);
  },
 
  render : function() {
		this.rendered = true;
		this.alternativesCollectionView.el = jQuery('table.alternativeList', this.el);
		this.newAlternative();
		this.alternativesCollectionView.render();
  },
  notify : function( broadcasted_id ) {
		this.collection.each( function( i ) {	
			if( i.get('id') == broadcasted_id ) {
				i.fetch();
				i.change();
			}
		});
  },
  newAlternative : function() {
	    var collection;
	
		if( this.collection ) {
			collection = this.collection;
		}
		else {
			collection = this;
		}
			
		if( collection.size() == 0 ||
		    collection.last().isNew() == false ) {
			var a;
			if( a ) {
				;
			}else{
				a = new Alternative;
			}
			a.set({name: 'new alternative'});
			collection.add( a );
//			a.bind('change', this.newAlternative );
		}
  },

});



