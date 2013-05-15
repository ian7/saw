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

        this.model.alternatives.on('decisionsChanged',this.onDecisionsChanged,this);  

        this.model.alternatives.on('add',this.onReset,this);
        this.model.alternatives.on('remove',this.onReset,this);
        this.model.on('change',this.render,this);

    },
    onRender: function(){
        this.onDecisionsChanged();   
    },
    onDecisionsChanged : function(){
        jQuery("td#status",this.el).html( this.model.decisionState() );
        jQuery("td#alternativeCount",this.el).html(this.model.alternatives.length);
        jQuery("td#metrics",this.el).html(JSON.stringify(App.main.capture.context.issues.models[0].getMetrics()).replace('{','').replace('}',''));
    },
    onReset : function(options){
        jQuery("td#alternativeCount",this.el).html(this.model.alternatives.length);
    }
  });
});

