/**
 * @author Marcin Nowak
 */
App.Controllers.Items = Backbone.Controller.extend({
    routes: {
    	//new Regexp('^([^\/]*)/.*$'): 'show',
    	//new Regexp('^[^\/]*/([^\/]*)\/.*$': 'show',
        "/:id":            "show",
        "":                         "index",
        "new":                      "newDoc",
//		"/:id/addTag": "addTag", 
    },
    
    show: function(id) {
        var item = new Item({ id: id });
        item.fetch({
            success: function(model, resp) {
//				el = jQuery("section.itemList");
                new App.Views.Show({ model: item, el: 'section.itemList'});
            },
            error: function() {
                new Error({ message: 'Could not find that document.' });
                window.location.hash = '#';
            }
        });

    },
	  
    index: function() {
		this.items_collection = new Items;
		this.items_collection.fetch({
			success: function(model, resp) {
				// this fails because of missing context
				// let's try it with events
				new App.Views.Index({collection: model, el: 'section.itemList'});						
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
    }
});


