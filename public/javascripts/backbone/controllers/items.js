/**
 * @author Marcin Nowak
 */
App.Controllers.Items = Backbone.Controller.extend({
    routes: {
    	//new Regexp('^([^\/]*)/.*$'): 'show',
    	//new Regexp('^[^\/]*/([^\/]*)\/.*$': 'show',
        "/:id":            "show",
        "":                         "index",
        "new":                      "newDoc"
    },
    
    show: function(id) {
    	this.item_id = id;
        var item = new Item({ id: id });
        item.fetch({
            success: function(model, resp) {
            	App.Components.Items.item_url = item.attributes.url;
                new App.Views.Show({ item: item });
            },
            error: function() {
                new Error({ message: 'Could not find that document.' });
                window.location.hash = '#';
            }
        });
    },
    
    index: function() {
        jQuery.getJSON('/items', function(data) {
            if(data) {
                var items = _(data).map(function(i) { return new Item(i); });
                new App.Views.Index({ items: items });
            } else {
                new Error({ message: "Error loading documents." });
            }
        });
    },
    
    newDoc: function() {
        new App.Views.Edit({ model: new Document() });
    },
    update: function( broadcasted_id) {	
	    	if( broadcasted_id == this.item_id ) {
	    		this.refresh();
	    	}		    	    	
    },
    refresh: function() {
    	this.show( this.item_id );
    },
    addTag: function() {
    	// logic comes here !
        jQuery.getJSON('/items/'+this.item_id+'/tag/list', function(data) {
            if(data) {
                var tags = _(data).map(function(i) { return new Tag(i); });
                new App.Views.Tags.Add({ el: tata, tags: tags });
            } else {
                new Error({ message: "Error loading tags to add." });
            }
    	});
    },
    
    tag: function( tag_id ) {
        jQuery.getJSON(this.item_url+'/tag/dotag?from_taggable_id='+tag_id, function(data) {
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
    }
});


