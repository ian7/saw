/*global Backbone,App*/

App.Models.Project = Backbone.Model.extend({
    initialize : function( model ){
      //this.attributes.id = 0;
      if( model ) {
        this.parse( model );
      }
    },
    parse: function( response ){
        this.id = response.id;
        // this converts simple children entry into the collections - 
        this.subProjects = new App.Models.Projects(response.children);
        return response;
    }        
});

App.Models.Projects = Backbone.Collection.extend({
    model: App.Models.Project
});