/**
 * @author Marcin Nowak
 */


jQuery.fn.flash = function( color, duration )
{

    var current = this.css( 'color' );

    this.animate( { color: 'rgb(' + color + ')' }, duration / 2 );
    this.animate( { color: current }, duration / 2 );

}

var ItemView = Backbone.View.extend({
  events : {
	"click .expand" : "expand",
	"click .deleteItem" : "deleteItem",
	"keypress .e6" : "editedItem",
	"click .e6" : "doExpand",
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
  editedItem : function( e ) {
     	// nasty but works.

		if (e.keyCode == 13) {
			this.model.save(
				{ name: jQuery("span.e6",this.el).html() },
				{ success : function( model, resp)  {
					model.parse( resp );
					model.change();
				}
			});			
		}
		/* timed saving has proven to be not so very sexy
         *
		 *
   	  	jQuery(this.el).stopTime("edit5");
	  	jQuery(this.el).oneTime(000,"edit5", function() {
			lastEditedItem.model.save(
				{ name: jQuery("span.e6",this).html() },
				{ success : function( model, resp)  {
					model.parse( resp );
					model.change();
				}
			});	
		});	
		*/
  },
  deleteItem : function() {
		var viewObject = this;
 		jQuery(".deleteItem",this.el).fastConfirm({
           position: "left",
              questionText: "Are you sure ?",
              onProceed: function(trigger) {
					viewObject.model.destroy();
                       $(trigger).fastConfirm('close');
               },
               onCancel: function(trigger) {
                       $(trigger).fastConfirm('close');
               }
            });	
  },
  doExpand : function() {
		if( this.isExpanded == false) {
			this.expand();
		}
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
	"click .expandAll" : "expandAll"
//	"keypress"		 : "shortcut"
  },
  initialize : function() {

	this.render();
	notifier.register(this);
	this.collection.bind('saved',this.newItem)

    // simply magic :)
    if( window.location.pathname.match('projects') ) {
		this.projectid = window.location.pathname.match('projects\/.*\/items')[0].substring(9,33);
	}

  },
 
  render : function() {			
		this._rendered = true;
	
		this._itemsCollectionView = new UpdatingCollectionView({
	      collection           : this.collection,
	      childViewConstructor : ItemUpdatingView,
	      childViewTagName     : 'p',
		  childViewClassName   : 'itemList'
	    });
	
		this._itemsCollectionView.el = this.el; //jQuery('#itemList');
		this._itemsCollectionView.render();
		jQuery(this.el).prepend("<div class = 'button orange expandAll'>Expand all</div>");
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
				preLastItem.view.doExpand();
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
						jQuery(model.view.el).effect("highlight", {}, 500);
					}
				});
			}
		});

		var thisView = this;
		
		if( this.projectid == broadcasted_id ) {
			this.collection.fetch({
				success: function(model, resp){
//					thisView.colllection
					thisView.render();
				}
			});
		}
		
  },
  expandAll : function() {
	_.each(this._itemsCollectionView._childViews, function( childView ) {
		childView.expand();
	});
  },
  shortcut : function() {
	alert("!");
  },
});


