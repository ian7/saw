/*global App, Backbone,_*/

App.module("main",function(){
    this.Context = Backbone.Marionette.Geppetto.Context.extend({
        initialize : function(){
            _(this).bindAll();
            this.listen("project:selected",this.projectSelected);
            this.project = new App.Models.Project();
        },
        projectSelected : function( args ){
            this.project.url = "/projects/"+args.id;
            this.project.fetch();
        },
        // this is going to store actual project reference
        project : null
    });
});
