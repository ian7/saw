/**
 * @author Marcin Nowak
 */
App.Controllers.Rs = Backbone.Controller.extend({
    routes: {
    	//new Regexp('^([^\/]*)/.*$'): 'show',
    	//new Regexp('^[^\/]*/([^\/]*)\/.*$': 'show',
 /*       "/:id":            "show",
        "/:id/show":            "show",
        "/:id/details":            "show",
        "/:id/alternatives":            "alternatives",
        "/:id/visualization":            "visualization",
        */
        "":                         "index",
//        "new":                      "newDoc",
//		"/:id/addTag": "addTag", 
    },
	initialize : function() {
		this.el = jQuery('section.itemList');
	},

    index: function() {
		this.items_collection = new Items;	
//		this.view = new App.Views.Index({collection: this.items_collection, el: 'section.itemList'});						

		this.items_collection.fetch({
			success: function(model, resp) {
			}
		});
    },
});


