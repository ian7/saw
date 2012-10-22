/*global App, Backbone,_*/

App.module("main.capture",function(){
    this.Context = Backbone.Marionette.Geppetto.Context.extend({
        initialize : function(){
            _(this).bindAll();

            // project is related to the mainContext, thus it needs to be bound there.
            this.parentContext.listen("project:selected",this.projectSelected);
            this.listen("issue:selected",this.issueSelected);

            this.listen("capture:issues:list",this.issueList);
            this.listen("capture:issues:details",this.issueDetails);
            
            this.mapCommand("capture:issues:new", this.newIssue );
            this.mapCommand("capture:alternatives:create",this.newAlternative);
            this.issues = new App.Models.Issues();
            this.issue = new App.Models.Issue();
        },
        // this is going to store actual project reference
        projectSelected : function( args ){
            this.issues.setProjectURL( args.id );
            this.fetchIssues();
        },
        issueSelected : function( args ){
            this.issue.id = args.id;
            this.issue.fetch();
        },
        issueList: function(){
            // create the view
            var view = new App.main.capture.Views.IssueList({collection: this.issues, context: this });
            
            // show it!
            App.main.layout.central.show(view);
            //this.region.show(view);
            //this.fetchIssues();
        },
        issueDetails : function() {
            // create the view
            var view = new App.main.capture.Views.IssueDetails({model: this.issue, context: this});
           
            App.main.layout.central.show(view); 
        },
        fetchIssues : function(){
            this.issues.fetch();
        },
        newIssue : Backbone.Marionette.Geppetto.Command({
            execute : function(){
                _(this).bindAll();
                console.log('create issue'); 
                this.context.issues.create({ project_id: this.context.parentContext.project.get('id') });
            }
        }),
        newAlternative : Backbone.Marionette.Geppetto.Command({
            execute : function(){
                _(this).bindAll();

                console.log('create alternative'); 

                this.issue = this.eventData.model;
                // create new alternative
                this.newAlternative = this.issue.alternatives.create();
                // wait until it gets saved 
                this.newAlternative.on('sync',this.synced,this);
            },
            synced : function(){
                // after it got saved, relate it to the issue, and remove trigger
                this.newAlternative.off('sync');
                // and relate it with the issue
                //debugger;
                this.newAlternative.relate( {item: this.issue, relation: "SolvedBy"});
            }
        })

    });
});
