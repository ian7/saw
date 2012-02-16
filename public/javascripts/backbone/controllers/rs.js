/**
 * @author Marcin Nowak
 */
App.Controllers.Rs = Backbone.Router.extend({
    routes: {
    	//new Regexp('^([^\/]*)/.*$'): 'show',
    	//new Regexp('^[^\/]*/([^\/]*)\/.*$': 'show',
        "/:id":            "show",
/*        "/:id/show":            "show",
        "/:id/details":            "show",z
        "/:id/alternatives":            "alternatives",
        "/:id/visualization":            "visualization", */
        "":                         "index",
//        "new":                      "newDoc",
//		"/:id/addTag": "addTag", 
    },
	initialize : function() {
		this.el = jQuery('section.itemList');
	},

    index: function() {
		this.items_collection = new Rs;	
		this.view = new App.Views.Rs.List({collection: this.items_collection, el: this.el });						

		this.items_collection.fetch({
			success: function(model, resp) {
			}
		});
        this.view.render();
    },
    show: function(id){
        this.index();
        r_to_focus = id;
    }
});

var r_to_focus = null;
