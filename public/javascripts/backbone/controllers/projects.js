/**
 * @author Marcin Nowak
 */
App.Controllers.Project = Backbone.Controller.extend({
    routes: {
        "" : "index",
    },

	initialize : function(){
		// this nicely finds project id
		if( window.location.pathname.match('projects') ) {
			this.projectid = window.location.pathname.match('projects\/.*$')[0].substring(9,33);
		}		
		this.items_collection = new Items;
		this.items_collection.urlOverride = window.location.pathname+'/items';
		this.itemsView = new App.Views.Items.ProjectIndex({collection: this.items_collection, el: 'section.itemList'});						
	},
    index: function() {  		
		this.items_collection.fetch({
			success: function(model, resp) {
				// this fails because of missing context
				// let's try it with events
//				alert('yeah');
			}
		});
		
    },

});


