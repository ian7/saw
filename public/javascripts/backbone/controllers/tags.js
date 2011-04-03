/**
 * @author Marcin Nowak
 */
App.Controllers.Tags = Backbone.Controller.extend({
    routes: {
    //    "add": 	 "add",
    //  "":      "index",
    //  "delete":"newDoc"
    },
    
    list: function(id) {
        var tags = new Tag({ id: id });
        tags.fetch({
            success: function(model, resp) {
                new App.Views.Tags.Index({ tags: tags });
            },
            error: function() {
                new Error({ message: 'Could not find that document.' });
                window.location.hash = '#';
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

