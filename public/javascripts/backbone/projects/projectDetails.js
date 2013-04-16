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
  //      jQuery("div#nameOfIssue",this.el).html( App.main.capture.context.issues.models[0].attributes.name);
        this.statusChart.setElement( chartEl );
        this.statusChart.render();
        this.onDecisionsChanged();
    },
    onDecisionsChanged : function(){
      
      var decisions = {};
	  var alternativesDecision = [];
	  var a = App.main.capture.context.issues.models[0].alternatives;
	  
	  for (var i = 0; i < a.length; i++){
	  	var decisionDesc = (a.models[i].isDecided()) ? a.models[i].decision() : a.models[i].isColliding() ? "Colliding" : "Not decided"; 
	  	if( decisions[decisionDesc]){
          decisions[decisionDesc] = decisions[decisionDesc] + 1;
        }
        else{
          decisions[decisionDesc] = 1;
        }
	  }

//	  console.log(decisions)	  
	  alternativesDecision.push(["Open", decisions["4f9d67e2e90a3e18b900002e"]])
	  alternativesDecision.push(["Positive", decisions["4f9d67e2e90a3e18b900002c"]])
	  alternativesDecision.push(["Negative", decisions["4f9d67e2e90a3e18b900002d"]])
	  alternativesDecision.push(["Colliding", decisions["Colliding"]])
	  alternativesDecision.push(["Not decided", decisions["Not decided"]])
			
      this.statusChart.data = alternativesDecision;
      this.statusChart.options.title =  App.main.capture.context.issues.models[0].attributes.name;
      this.statusChart.render();
    }
  });
});

