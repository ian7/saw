/**
 * @author Marcin Nowak
 */
App.Controllers.Tags = Backbone.Router.extend({
    routes: {
    //    "add": 	 "add",
    //  "":      "index",
    //  "delete":"newDoc"
    },
    
    list: function(id) {
        var tags = new Tag({ id: id });

        jQuery.getJSON('/items/'+this.item.id+'/tag/tags_list', function(data) {
	    if(data) {
            	var tags = _(data).map(function(i) { return new Tag(i); });
                new App.Views.Tags.List({ el:tata, tags: tags });
            }
        });
    },
    
    index: function() {
        jQuery.getJSON('/items.json', function(data) {
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
    }
});

