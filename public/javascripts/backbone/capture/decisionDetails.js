/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture",function(){
  this.Views.DecisionDetails = Backbone.Marionette.ItemView.extend({
    tagName : "tr",
    template: JST['capture/decisionDetails'],
    templateHelpers : {
      findDecisionName : function(){
        var name = "unknown";
        _(this.context.decisions.models).each( function( decision ){
          if( decision.get('id') === this.get('origin')){
            name = decision.get('name');
          }
        },this);
        return name;
      },
      printTimestamp : function(){
       var time = this.attributes.updated_at.match("[0-9]{1,2}:[0-9]{2}")[0];
       var date = this.attributes.updated_at.match("[0-9]{4}-[0-9]{2}-[0-9]{2}")[0];
       
       return( time + " " + date );       
      }
    },
    events : {
      "click div.button#deleteDecision" :  "deleteDecision"
    },
    initialize : function(options) {
      _(this).bindAll();
      this.model.on('gotProjects',this.gotProjects,this);
      this.model.on('gotProjects',this.projectChanged,this);
      },
    onRender : function() {
      this.model.updateProject( this.context );
      this.hide();
      },
    deleteDecision : function(){
      this.model.destroy();
    },
    gotProjects : function(){
      if( this.model.project ) {
        jQuery("td.projectName",this.el).html( this.model.project.get('name') );
      }
      else{
        jQuery("td.projectName",this.el).html("(none!)");
      }
    },
    projectChanged : function(){
      if( this.model.project && (this.model.project.get('id') === this.context.project.get('id') )){
        this.show();
      }
      else{
        this.hide();
      }
    },
    hide : function(){
      jQuery( this.el ).hide();
    },
    show : function(){
      jQuery( this.el ).show();
    }
  });
});