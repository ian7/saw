/**
 * @author Marcin Nowak
 */
App.Controllers.Items = Backbone.Controller.extend({
    routes: {
        "/:id":            "show",
        "":                         "index",
        "new":                      "newDoc"
    },
    
    show: function(id) {
    	this.item_id = id;
        var item = new Item({ id: id });
        item.fetch({
            success: function(model, resp) {
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
    update: function(id) {
    	if( id = this.item_id ) {
    		this.show( this.item_id );
    	}
    }
    
});


