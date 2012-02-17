/**
 * @author Marcin Nowak
 */
App.Controllers.Rs = Backbone.Router.extend({
    routes: {
    	//new Regexp('^([^\/]*)/.*$'): 'show',
    	//new Regexp('^[^\/]*/([^\/]*)\/.*$': 'show',
        ":type/:id":            "show",
/*        "/:id/show":            "show",
        "/:id/details":            "show",z
        "/:id/alternatives":            "alternatives",
        "/:id/visualization":            "visualization", */
        "":                         "index",
        ":type": "listType", 
//        "new":                      "newDoc",
//		"/:id/addTag": "addTag", 
    },
	initialize : function() {
		this.el = jQuery('section.itemList');
        this.items_collection = new Rs; 
        this.view = new App.Views.Rs.List({collection: this.items_collection, el: this.el });                       
	},

    index: function() {
        this.items_collection.reset([]);
        this.items_collection.urlOverride="/scope/type/Issue";	

		this.items_collection.fetch({
			success: function(model, resp) {
			}
		});
 //       this.view.render();
    },
    listType: function(type) {
        //this.items_collection = new Rs; 
        this.items_collection.reset([]);
        this.items_collection.urlOverride="/scope/type/"+type;  

        this.items_collection.fetch({
            success: function(model, resp) {
            }
        });
   //     this.view.render();    
    },
    show: function(type,id){
        r_to_focus = id;
        this.listType(type);
    }
});

var r_to_focus = null;
