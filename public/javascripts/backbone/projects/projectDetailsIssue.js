/*global App, Backbone,_,jQuery,JST*/

App.module("main.projects",function(){
  this.Views.ProjectDetailsIssue = Backbone.Marionette.ItemView.extend({
    template: JST['projects/projectDetailsIssue'],
    tagName: "tr", 
    className: 'projectDetailsIssue',
//    itemView: App.main.projects.Views.ProjectDetailsIssue,
//    itemViewContainer: "table.alternativeListDetails tbody",
    events: {
    },
    initialize: function() {
        _(this).bindAll();

        this.model.on('decisionsChanged',this.onDecisionsChanged,this);
        this.model.alternatives.on('reset',this.onReset,this);
        this.model.on('change',this.render,this);

        // if alternatives ain't updated, then...
        if( !this.model.areAlternativesUpdated ){
            this.model.updateAlternatives();
        }
        // otherwise if we have alternatives, then just let's update decisions
        else{
            this.updateDecisions();
        }
    },
    onRender: function(){
        this.onDecisionsChanged();   
    },
    onDecisionsChanged : function(){
        jQuery("td#status",this.el).html( this.model.decisionState() );
        jQuery("td#alternativeCount",this.el).html(this.model.alternatives.length);
    },
    onReset : function(options){
        jQuery("td#alternativeCount",this.el).html(this.model.alternatives.length);
        this.updateDecisions();
    },
    updateDecisions : function() {
         _(this.model.alternatives.models).each( function( alternative ){
                alternative.updateDecisions(App.main.context);
         },this);
    }
  });
});

