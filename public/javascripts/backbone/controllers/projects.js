/**
 * @author Marcin Nowak
 */
App.Controllers.Project = Backbone.Controller.extend({
    routes: {
        "":                         "summary",
    },

	initialize : function(){
		// this nicely finds project id
		if( window.location.pathname.match('projects') ) {
			this.projectid = window.location.pathname.match('projects\/.*[\/$]')[0].substring(9,33);
		}		
	},
    summary: function() {  
//		this.items_collection = new Items;
//		this.items_collection.fetch({
//			success: function(model, resp) {
//				new App.Views.Index({collection: model, el: 'section.itemList'});						
//			}
			
//		});
    },

});


