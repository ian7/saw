/**
 * @author Marcin Nowak
 */
App.Controllers.Items = Backbone.Router.extend({
    routes: {
    	//new Regexp('^([^\/]*)/.*$'): 'show',
    	//new Regexp('^[^\/]*/([^\/]*)\/.*$': 'show',
        "/:id":            "show",
        "/:id/show":            "show",
        "/:id/details":            "show",
        "/:id/alternatives":            "alternatives",
        "/:id/visualization":            "visualization",
        "":                         "index",
        "new":                      "newDoc",
        "elicit": "elicit", 
//		"/:id/addTag": "addTag", 
    },
	initialize : function() {
		this.el = jQuery('section.itemList');
	},
	cleanUp : function() {
		if( this.view ) {
			this.view.el.innerHTML = "";
			delete this.view;
			this.view = null;
		}
	},
	visualization: function( id ){
		this.cleanUp();

		this.item = new Item({ el: 'section.itemList'});
		this.item.id = id;
		this.item.fetch();

		this.view = new App.Views.Items.Visualization({ model: this.item, id: id, el: 'section.itemList' });
		this.view.render();
	},
	alternatives: function( id ) {

		this.cleanUp();
		this.el.html("<table class='alternativeListDetails'></table>");

		el = jQuery('section.itemList');
		this.item = new Item({ el: 'section.itemList'});
		this.item.id = id;
		this.item.fetch();
		this.collection = new Alternatives;
		this.collection.url = this.item.url() + '/alternatives';
		this.collection.item_url = this.item.url();
 		
		this.view = new App.Views.Alternatives.ListDetails( {collection: this.collection, el: 'section.itemList' });
		this.view.model = this.item;
		
		this.collection.fetch();
		this.view.render();
	},
    show: function(id) {
		this.cleanUp();
		
		// id for the item 
		this.item = new Item({ el: 'section.itemList'});
        this.view = new App.Views.Show({ model: this.item, el: 'section.itemList'});     

		this.item.id = id;
        this.item.fetch({
            success: function(model, resp) {
//				el = jQuery("section.itemList");
            },
            error: function() {
                new Error({ message: 'Could not find that document.' });
                window.location.hash = '#';
            }
        });

    },
	  
    index: function() {
		this.cleanUp();
		this.items_collection = new Items;	
		this.view = new App.Views.Index({collection: this.items_collection, el: 'section.itemList'});						

		this.items_collection.fetch({
			success: function(model, resp) {
			}
		});
    },
    
    newDoc: function() {
        //new App.Views.Edit({ model: new Document() });
    },
    update: function( broadcasted_id ) {	
	    	//if( App.Components.Items.view ) {
	    	//	App.Components.Items.view.trigger('update',broadcasted_id);
	    	//}
	    	
	
	
	    	var c = App.Components.Items;
	    	
	    	if( broadcasted_id == this.item_id ) {
	    		this.refresh();
	    	}
	    	
	    	if( c.alternatives && c.alternatives.alternatives ) {
	    		//_.each(c.alternatives.alternatives)
	    		_(c.alternatives.alternatives).each(function(a) {
	    			if( a.id == broadcasted_id ) {
	    				//alert( a.id );
	    				a = new Alternative({id: broadcasted_id });
	    				a.item_id = c.item_id
	    				a.fetch({
	    					success: function( model, resp) {
			    				o = JST.alternatives_show({ a: a });
			    				e = jQuery("#"+broadcasted_id);
			    				e.html( o );

   					           jQuery('.alternativeEdit'+broadcasted_id).each( function(i){
						       	  jQuery(this).attr('contenteditable','true');
						       	  jQuery(this).keypress( function() {
						       	  	jQuery(this).stopTime("edit5")
						       	  	jQuery(this).oneTime(1000,"edit5", function() {
								         jQuery.ajax({
								         	type: 'PUT',
								         	url: '/items/'+jQuery(this).parent().parent().attr('id'),
								         	data: jQuery(this).attr('id')+'='+jQuery(this).html()   	 
								         });       	  		
						       	  	});
						       	  });	               	  	
						       	 });     

		    					}
	    				});
	    			}
	    		});
	    	}
	    	// if we're displaying something then let's broadcast update !		    	
	    	    	
    },
    refresh: function() {
    	this.show( this.item_id );
    },
    addTag: function() {
    	// logic comes here !
        jQuery.getJSON('/items/'+this.item_id+'/tag/list', function(data) {
            if(data) {
                var tags = _(data).map(function(i) { return new Tag(i); });
                this.tags = new App.Views.Tags.Add({ el: tata, tags: tags });
            } else {
                new Error({ message: "Error loading tags to add." });
            }
    	});
    },
    
    tag: function( tag_id ) {
        jQuery.getJSON(this.model.item_url+'/tag/dotag?from_taggable_id='+tag_id, function(data) {
	    	// so let's update it !'
   	    	//App.controller.update();
    		});
    },
    unTag: function( tagging_id ) {
        jQuery.getJSON(this.item_url+'/tag/untag?tagging_id='+tagging_id, function(data) {
	    	// so let's update it !'
   	    	//App.controller.update();
    		});    		
    },
    newAlternative: function() {
        jQuery.getJSON('/items/'+this.item_id+'/alternatives/new', function(data) {
	    	// so let's update it !'
   	    	//App.controller.update();
    		});    		    	
    },
    expandAlternatives: function( item_id ){
        jQuery.getJSON('/items'+item_id+'/alternatives', function(data) {
        	if(data){
        		jQuery('#'+item_id).html = JST.alternatives_list_list()
        	}
        });
    },
    elicit : function(){
    	this.cleanUp();
    	// here we load all the fuckers
		this.all_items_collection = new Items;	
		this.all_items_collection.urlOverride = "/items";
		this.all_items_collection.fetch();
		// here we get only those which belong to the project
		this.items_collection = new Items;	
		this.items_collection.fetch();
		

		this.view = new App.Views.Items.ElicitCollection({
			 collection: this.items_collection, 
			 all_collection: this.all_items_collection,
			 el: 'section.itemList'});						
    }
});


