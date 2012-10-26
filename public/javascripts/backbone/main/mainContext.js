/*global App, Backbone,_*/

App.module("main",function(){
    this.Context = Backbone.Marionette.Geppetto.Context.extend({

        // this is going to store actual project reference
        project : null,

        // this should be later replaced by the DynamicType equivalent
        decisions : new App.Data.Collection(),

        initialize : function(){
            _(this).bindAll();
            this.listen("project:selected",this.projectSelected);
            this.project = new App.Models.Project();

            // having a list of decision tags within the main scope appears to be reasonable.
            this.decisions.url = "/scope/type/Decision";
            this.decisions.fetch();
        },
        projectSelected : function( args ){
            this.project.url = "/projects/"+args.id;
            this.project.fetch();
        }

    });
});
