

AlternativeUpdatingView  = Backbone.View.extend({
	className : "decision", 
    events : {
		"keypress .name" 			: "editedName",
		"click .deleteAlternative"	: "deleteAlternative",
		"click .unrelateAlternative": "unrelateAlternative",
		"click .decide"				: "decide"
    },
    initialize: function() {
	    this.render = _.bind(this.render, this); 
	    this.model.bind('change', this.render);
		notifier.register(this);
    },
    
    render: function() {

	   this.el.innerHTML = JST.alternatives_show( {a: this.model} );
	
	   color = "white";
	   
	   if( this.model.attributes.decisions ) {
		   _.each( this.model.attributes.decisions, function( decision ) {
			    if( decision.count > 0 ) {
					if( color == 'white' ) {
						color = decision.color;
					}
					else {
						color = 'gray';
					}
				}
			});
		}
	   jQuery(this.el).addClass(color);
	
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
					model.parse( resp );
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
	decide : function (element) {
		//alert(element.target.id);
		jQuery.getJSON( this.model.get('relation_url') + '/tag/dotag?from_taggable_id='+element.target.id, function(data) {});
	},
	notify : function( broadcasted_id ) {
		if( this.model.id == broadcasted_id ) {
			this.model.fetch();
		}
	},
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



