/**
 * @author Marcin Nowak
 */
App.Controllers.Project = Backbone.Router.extend({
    routes: {
        "" : "index",
    },

	initialize : function(){
		// this nicely finds project id
		if( window.location.pathname.match('projects') ) {
			this.projectid = window.location.pathname.match('projects\/.*$')[0].substring(9,33);
		}		
		this.model = new R;
		this.model.id = this.projectid;
		this.items_collection = new Items;
		this.items_collection.urlOverride = window.location.pathname+'/items';
		this.itemsView = new App.Views.Items.ProjectIndex({model: this.model, collection: this.items_collection, el: 'section.itemList'});						
	},
    index: function() {  		
		this.model.fetch();
		this.items_collection.fetch();
		
    },

});


