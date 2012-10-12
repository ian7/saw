/*global App, Backbone,_*/

App.module("main.capture",function(){
    this.Context = Backbone.Marionette.Geppetto.Context.extend({
        initialize : function(){
            _(this).bindAll();

            // project is related to the mainContext, thus it needs to be bound there.

            this.parentContext.listen("project:selected",this.projectSelected);
            this.listen("capture:issues:list",this.issueList);

            this.issues = new App.Models.Items();
        },
        // this is going to store actual project reference
        projectSelected : function( args ){
            this.issues.url = "/projects/"+args.id+"/items";
            this.fetchIssues();
        },
        issueList: function(){
            // create the view
            var view = new App.main.capture.Views.IssueList({collection: this.issues, context: this });
            // show it!
            this.region.show(view);
            //this.fetchIssues();
        },
        fetchIssues : function(){
            this.issues.fetch();
        }
    });
});
