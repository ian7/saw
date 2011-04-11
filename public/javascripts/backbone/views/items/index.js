/**
 * @author Marcin Nowak
 */


var ItemView = Backbone.View.extend({
  events : {
	"click .expand" : "expand",
	"click .deleteItem" : "deleteItem",
	"keypress .e6" : "editedItem"
  },

  render : function() {
   this.el.innerHTML = JST.items_index( {item: this.model} );
   this.isExpanded = false;

   return this;
  },
  editedItem : function() {
     	// nasty but works.
	    var lastEditedItem = this;

	  	jQuery(this.el).stopTime("edit5");
	  	jQuery(this.el).oneTime(1000,"edit5", function() {
			lastEditedItem.model.save(
				{ name: jQuery(this).children().children("span.e6").html() },
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
			
			this.alternatives_collection = new Alternatives;
			// let's see if we'll need it
			this.alternatives_collection.issueView = this;
			this.alternatives_collection.url = '/items/'+this.model.get('id')+'/alternatives';

			this.alternatives_collection.fetch({
				success: function(model, resp) {
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
  }
});


App.Views.Index = Backbone.View.extend({
  events : {
	"click .newItem" : "newItem"
  },
  initialize : function() {
	this._itemsCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : ItemUpdatingView,
      childViewTagName     : 'li'
    });
	this.render();
  },
 
  render : function() {
		this._rendered = true;
		this._itemsCollectionView.el = jQuery('#itemList');
		this._itemsCollectionView.render();
  },
  
  newItem : function() {
		i = new Item;
		i.set({name: '(unnamed)'});
		this.collection.add( i );
  },
});




/*
App.Views.Index = Backbone.View.extend({
	events: {
		"click .knowledge_item":	"expandAlternatives"
	},
	
    initialize: function() {
        this.collection = this.options.items;





	  var that = this;
	    this._itemViews = [];

	    this.collection.each(function(item) {
	      that._itemViews.push(new ItemDonutView({
	        model : item,
	        tagName : 'li'
	      }));
	    });


	


        this.render();
    },
    
    render: function() {
    	
		var out = "";
        if(this.items.length > 0) {
      		out = JST.items_index( {items: this.items} );       		
        } else {
            out = "<h3>No documents! <a href='#new'>Create one</a></h3>";
        }
        jQuery(this.el).html(out);
        jQuery('#app').html(this.el);
		
//		return this;
    },
    
    expandAlternatives: function() {
    	item_id = jQuery(this).attr('id');
        jQuery.getJSON('/items'+item_id+'/alternatives', function(data) {
        	if(data){
        		jQuery('#'+item_id).html = JST.alternatives_list_list();
        	}
        });
    }
});

*/

/*
var DonutCollectionView = Backbone.View.extend({
  initialize : function() {
    var that = this;
    this._donutViews = [];
 
    this.collection.each(function(donut) {
      that._donutViews.push(new UpdatingDonutView({
        model : donut,
        tagName : 'li'
      }));
    });
  },
 
  render : function() {
    var that = this;
    // Clear out this element.
    $(this.el).empty();
 
    // Render each sub-view and append it to the parent view's element.
    _(this._donutViews).each(function(dv) {
      $(that.el).append(dv.render().el);
    });
  }
});

*/