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

      this.collection.on('decisionsChanged',this.onDecisionsChanged,this);

      this.statusChart = new App.main.Views.PieChart();
    },
    onRender: function(){
        var chartEl = jQuery("td#graphs",this.el);
        this.statusChart.setElement( chartEl );
        this.statusChart.render();
    },
    onDecisionsChanged : function(){
      var decisions = {};

      _(this.collection.models).each( function( issue ){
        var decisionState = issue.decisionState();
        
        if( decisions[decisionState]){
          decisions[decisionState] = decisions[decisionState] + 1;
        }
        else{
          decisions[decisionState] = 1;
        }
      },this);

      var decisionArray = [];
      _(decisions).each( function( decisionCount, decisionDescription ){
        var decisionRow = [ decisionDescription,decisionCount ];
        decisionArray.push( decisionRow );
      },this);

      this.statusChart.data = decisionArray;
      this.statusChart.render();
    }
  });
});

