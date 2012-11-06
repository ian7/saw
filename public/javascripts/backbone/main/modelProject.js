/*global Backbone,App,_*/

App.Models.Project = App.Data.Item.extend({
    initialize : function( model ){
      _(this).bindAll();

      App.Models.Project.__super__.initialize.apply(this);
      
      this.set('type','Project');
      if( model ) {
        this.parse( model );
      }
    },
    parse: function( response ){
        this.id = response.id;
        // this converts simple children entry into the collections - 
        this.subProjects = new App.Models.Projects(response.children);
        return response;
    },     
    addItem : function( item ){
        item.tag(this);
    },
    removeItem : function( item ){
        item.untag(this);
    }
});

App.Models.Projects = App.Data.Collection.extend({
    model: App.Models.Project,
    /* default url is set to "projects" root - sub-projects are to be loaded recursively */
    url: "/projects"
});