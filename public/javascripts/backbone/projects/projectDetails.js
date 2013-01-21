/*global App, Backbone,_,jQuery,JST*/

App.module("main.projects",function(){
  this.Views.ProjectDetails = Backbone.Marionette.CompositeView.extend({
    template: JST['projects/projectDetails'],
    tagName: "div", 
//    itemView: App.main.projects.Views.ProjectDetailsIssue,
    itemViewContainer: "table#issueList tbody",
    events: {
    },
    speedButtons : {
        "Issue List" : {
          color: "orange",
          event: "capture:issues:list",
          shortcut: "ctrl+i"
        }
    },
    initialize: function() {
        _(this).bindAll();
      this.itemView = App.main.projects.Views.ProjectDetailsIssue;
      this.collection = App.main.capture.context.issues;
      this.itemViewOptions = {context:this.context};
    },
    onRender: function(){
        
    }
  });
});

