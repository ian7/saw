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
      "click #deleteDecision" :  "onDeleteDecision",
      "click #overrideDecision" :  "onOverrideDecision"
    },
    initialize : function(options) {
      _(this).bindAll();
      this.model.on('change',this.render,this);
     // this.model.updateProject( this.context );
      },
    onRender : function() {
      jQuery("#deleteDecision",this.el).popover({
              trigger: 'hover',
              title: 'Delete',
              content: 'Permanently delete this decision',
              placement: 'right'
          });
      jQuery("#overrideDecision",this.el).popover({
              trigger: 'hover',
              title: 'Override',
              content: 'Override (ignore) this decision',
              placement: 'right'
          });
      this.projectChanged();
      },
    onDeleteDecision : function(){
      var promptText = "Are you sure that you want to delete selected decision?";
      if( confirm( promptText ) ) {
        if( this.model.collection ) {
          // remove it from the collection first
          this.model.collection.remove( this.model );
          }
        else {
          alert( 'not in the collection - fucker: ' + this.model.get('name') );
        }
        // and then destroy it.
        this.model.destroy();
        jQuery("div.popover").remove();
        }

    },
    onOverrideDecision : function(){
      alert('to be implemented');
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
      if( this.model.projects &&
          _(this.model.projects.models).find( 
              function( project ){ return project.get('id') === App.main.context.project.get('id'); })
          ){
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