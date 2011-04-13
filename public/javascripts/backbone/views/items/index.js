/**
 * @author Marcin Nowak
 */


var ItemView = Backbone.View.extend({
  events : {
	"click .expand" : "expand",
	"click .deleteItem" : "deleteItem",
	"keypress .e6" : "editedItem"
  },

  alternativesCollection : null,

  render : function() {

	this.alternativesCollection.item_url = window.location.pathname+"/"+this.model.get('id');
	this.alternativesCollection.url = window.location.pathname+"/"+this.model.get('id')+'/alternatives';

//	this.tempEL = document.createElement("tr");
//	this.tempEL.innerHTML = JST.items_index( {item: this.model} );

   this.el.innerHTML = JST.items_index( {item: this.model} );
  
   if(  this.isExpanded == true) {
		this.isExpanded = false;
		this.expand();
	}
	else {
		this.isExpanded = false;
	}
	
	// finally attach it ;)
//	this.el.innerHTML = this.tempEL.innerHTML;

   return this;
  },
  editedItem : function() {
     	// nasty but works.
	    var lastEditedItem = this;

	  	jQuery(this.el).stopTime("edit5");
	  	jQuery(this.el).oneTime(1000,"edit5", function() {
			lastEditedItem.model.save(
				{ name: jQuery("span.e6",this).html() },
				{ success : function( model, resp)  {
					model.parse( resp );
					model.change();
				}
			});	
		});	
  },
  deleteItem : function() {
		this.model.destroy();
  },
  expand: function(){
		if( this.isExpanded == false ) {
			this.isExpanded = true;
			jQuery(".expand", this.el).html("Collapse");
			
		   new App.Views.Alternatives.List({ collection: this.alternativesCollection, el: this.el });

			this.alternativesCollection.fetch({ silent: false,
				success: function(model, resp) {
//					model.issueView.model.change();
					model.issueView.alternativesCollection = model;
// this can be executed somewhere else :)					
					new App.Views.Alternatives.List({ collection: model, el: model.issueView.el });
				}
			});
		}
		else {
			this.isExpanded = false;
			jQuery("table.alternativeList", this.el).html("<!-- nothing -->");
			jQuery(".expand", this.el).html("Expand");
		}
		
  }
});


var ItemUpdatingView = ItemView.extend({
  initialize : function(options) {
    this.render = _.bind(this.render, this); 
    this.model.bind('change', this.render);

	this.alternativesCollection = new Alternatives;
   
	this.alternativesCollection.issueView = this;
  }
});


App.Views.Index = Backbone.View.extend({
  events : {
	"click .newItem" : "newItem",
//	"keypress"		 : "shortcut"
  },
  initialize : function() {
	this._itemsCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : ItemUpdatingView,
      childViewTagName     : 'li'
    });
	this.render();
	notifier.register(this);
	this.collection.bind('saved',this.newItem)
  },
 
  render : function() {
		this._rendered = true;
		this._itemsCollectionView.el = this.el; //jQuery('#itemList');
		this._itemsCollectionView.render();
		this.newItem();
  },
  
  newItem : function() {
		var collection;

		if( this.collection ) {
			// we're called from the render method
			collection = this.collection; 
		}
		else {
			// we're called because collection element has been saved 
			collection = this;			
			var preLastItem = collection.last();
			if( preLastItem.view ) {
				preLastItem.view.expand();
			}
		}
        
		i = new Item;
		i.set({name: '(unnamed)'});
		collection.add( i );
		
		//alert('asdf')
  },
  notify : function( broadcasted_id ) {
		this.collection.each( function( i ) {	
			if( i.get('id') == broadcasted_id ) {
				i.fetch({
					success: function(model,resp) {
						model.change();
					}
				});
			}
		});
  },
  shortcut : function() {
	alert("!");
  },
});


