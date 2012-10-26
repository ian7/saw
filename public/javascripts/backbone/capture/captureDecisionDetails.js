/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture",function(){
  this.Views.DecisionDetails = Backbone.Marionette.ItemView.extend({
    tagName : "tr",
    template: JST['capture/captureDecisionDetails'],
    templateHelpers : {
      findDecisionName : function(){
        var name = "unknown";
        _(this.context.decisions.models).each( function( decision ){
          if( decision.get('id') === this.get('origin')){
            name = decision.get('name');
          }
        },this);
        return name;
      }
    },
    events : {
    },
    initialize : function(options) {
      _(this).bindAll();
      this.model.on('gotProjects',this.gotProjects,this);
      },
    onRender : function() {
      this.model.updateProject( this.context );
      },
    gotProjects : function(){
      if( this.model.project ) {
        jQuery("td.projectName",this.el).html( this.model.project.get('name') );
      }
      else{
        jQuery("td.projectName",this.el).html("(none!)");
      }

    }
  });
});