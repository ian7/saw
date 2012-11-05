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

            this.mapCommand("capture:alternative:decided",this.decided);

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
        }),
/*        loadDecisions : Backbone.Marionette.Geppetto.Command({
            solvedByRelations : new Backbone.Collection(),
            decisions : new Backbone.Collection(),

            execute : function(){
                _(this).bindAll();

                // snatch alternative reference from the 
                this.alternative = this.eventData.alternative;

                if( this.eventData.issue ){
                    this.issue = this.eventData.issue;
                }
                else{
                    this.issue = this.context.issue;
                }

                // fetching SBs
                this.solvedByRelations.url = this.alternative.url() + "/relations_from/SolvedBy";
                this.solvedByRelations.on('reset',this.onSolvedByRelationsReady,this);
                this.solvedByRelations.fetch();
            },
            onSolvedByRelationsReady : function(){
                debugger;
            }
        })*/
    decided : Backbone.Marionette.Geppetto.Command({
        execute : function(){
            var decisionTag = null;

            // let's find the decision
            _(this.context.parentContext.decisions.models).each( function( decision ){
                if( decision.get('name') === this.eventData.decisionName ){
                    decisionTag = decision;
                }
            },this);

            var relationTaggable = null;
            // let's find the right SolvedBy relation
            _(this.context.issue.relationsTo.models).each( function( relation ){
                if( relation.get('origin') === this.eventData.alternative.get('id') ){
                    relationTaggable = relation;
                }
            },this);

            // if we found both, then let's make the tagging
            if( decisionTag && relationTaggable ){
                relationTaggable.tag( decisionTag, { project_id: this.context.parentContext.project.get('id') });
            }
            else { // something went really bad.
                console.log("");
            }
        }
    })
// end of class
});
// end 
});
