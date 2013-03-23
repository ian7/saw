/*global App, Backbone,_,jQuery*/

App.module("main.capture",function(){
    this.Context = Backbone.Marionette.Geppetto.Context.extend({
        initialize : function(){
            _(this).bindAll();

            // project is related to the mainContext, thus it needs to be bound there.
            this.parentContext.listen("project:selected",this.projectSelected);
            // project notification came 
            this.parentContext.project.on('notify',this.projectNotified,this);

            this.listen("issue:selected",this.issueSelected);

            this.listen("capture:issues:list",this.issueList);
            this.listen("capture:issues:details",this.issueDetails);
            this.listen("capture:issues:reuse",this.issueReuse);

            this.listen("capture:project:export",this.projectExport);
            this.listen("capture:project:import",this.projectImport);
            this.listen("capture:project:reportTabular",this.projectReportTabular);
            this.listen("capture:project:reportBullets",this.projectReportBullets);
            this.listen("capture:project:delete",this.projectDelete);

            this.mapCommand("capture:issues:new", this.newIssue );
            this.mapCommand("capture:alternatives:create",this.newAlternative);
            this.listen("capture:alternatives:reuse",this.alternativeReuse);

            this.mapCommand("capture:alternative:decided",this.decided);

            // it used to be instantiated here, but was moved to the main module
            this.issues = this.parentContext.issues;
            // focused issue - let's skip creation of the empty object...
            //this.issue = new App.Models.Issue();
            
            // all issues in the repository
            this.allIssues = new App.Models.Issues();
            this.allIssues.url = "/scope/type/Issue";

            this.allAlternatives = new App.Models.Alternatives();
            this.allAlternatives.url = '/scope/type/Alternative';

            // this is supposed to be used as generic artifact reference. 
            // for tagging purposes for example
            this.item = null;

            this.listen( "capture:item:relate",this.itemRelate );
        },
        // this is going to store actual project reference
        projectSelected : function( args ){
            this.issues.setProjectURL( args.id );
            this.fetchIssues();
        },
        projectNotified : function( notification ){
            if( notification.distance === 1 ){
                this.fetchIssues();
            }
        },
        issueSelected : function( args ){
            this.issue = new App.Models.Issue({id:args.id});
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

            this.parentContext.trigger("item:selected",this.issue);
        },
        issueReuse : function(){
            var view = new App.main.capture.Views.IssueReuse({collection: this.allIssues, context: this});
            this.allIssues.fetch();
           
            App.main.layout.central.show(view);             
        },
        alternativeReuse : function(){
            var view = new App.main.capture.Views.AlternativeReuse({collection: this.allAlternatives, context: this});
            this.allAlternatives.fetch();

            App.main.layout.central.show( view );
        },
        fetchIssues : function(){
            this.issues.fetch();
        },
        newIssue : Backbone.Marionette.Geppetto.Command({
            execute : function(){
                _(this).bindAll();

                console.log('create issue'); 
                // { project_id: this.context.parentContext.project.get('id') }

                this.newIssue = this.context.issues.create();
                this.newIssue.on('sync',this.synced,this);
            },
            synced : function() {
                this.newIssue.off('sync');
                this.context.parentContext.project.addItem( this.newIssue );
            }
        }),
        newAlternative : Backbone.Marionette.Geppetto.Command({
            execute : function(){
                _(this).bindAll();

                console.log('create alternative'); 

                if( this.eventData && this.eventData.model ) {
                    this.issue = this.eventData.model;
                }
                else{ 
                    this.issue = this.context.issue;
                }

                var alternativePresets = null;
                if( this.eventData && this.eventData.alternative ){
                    alternativePresets = this.eventData.alternative;
                }

                // create new alternative
                this.newAlternative = new App.Models.Alternative( alternativePresets );
                this.newAlternative.save();
                // wait until it gets saved 
                this.newAlternative.on('sync',this.synced,this);
            },
            synced : function(){
                // after it got saved, relate it to the issue, and remove trigger
                this.newAlternative.off('sync');
                // and relate it with the issue
                //debugger;
                this.issue.relate( {item: this.newAlternative, relation: "SolvedBy"});
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
            _(this.eventData.alternative.relationsFrom.models).each( function( relation ){
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
    }),
    itemRelate : function( options ){

        this.item = options;

        var artifactCollection = new App.Data.SuperCollection();
        artifactCollection.addCollection( this.allIssues );
        artifactCollection.addCollection( this.allAlternatives );

        var acceptableTypes = _(this.parentContext.types.models).filter( function( type ){
            var found = false;

            if( !type.isA("Relation") ){
                return false;
            }

            _(type.get('scopes')).each(function( scope ){
                if( this.item.get('type') === scope.scope ) {
                    found = true;
                }
            },this);
            return found;
        },this);

     //   debugger;

        var view = new App.main.capture.Views.ItemRelate({ collection: artifactCollection, context: this});
        this.allIssues.fetch();
        this.allAlternatives.fetch();

        App.main.layout.modal.show( view );        
    },
    projectDelete : function(){
        //this.dispatchGlobally("project:delete");
        this.parentContext.project.destroy();
        this.dispatchGlobally("projects:index");
    },
    projectImport : function(){
        //this triggers file import field in the issue list
          jQuery('#fileupload').click();
    },
    projectExport : function(){
        window.open(window.location.origin+"/projects/"+this.parentContext.project.get('id')+"/export.json" ,'export pop-up');
    },
    projectReportTabular : function(){
        window.open(window.location.origin+"/projects/"+this.parentContext.project.get('id')+"/report" ,'export pop-up');
    },
    projectReportBullets : function(){
        window.open(window.location.origin+"/projects/"+this.parentContext.project.get('id')+"/report2" ,'export pop-up');
    }
// end of class
});
// end 
});
