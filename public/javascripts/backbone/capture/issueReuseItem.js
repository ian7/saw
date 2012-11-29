/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.IssueReuseItem = Backbone.Marionette.CompositeView.extend({
    template: JST['capture/issueReuseItem'],
    events: {
      'click div#item': 'onItemClick'
    },
    initialize: function() {
      _(this).bindAll();
      this.updateStatus();
      this.context.issues.on('add', this.updateStatus, this);
      this.context.issues.on('remove', this.updateStatus, this);
      this.model.relationsTo.on('reset',this.gotRelationsTo,this);
    },
    onRender: function() {
      this.model.updateRelationsTo();
      this.updateStatus();
    },
    updateStatus: function() {
      if(this.context.issues.get(this.model.get('id'))) {
        jQuery("span#status", this.el).html("found");
      } else {
        jQuery("span#status", this.el).html("absent");
      }
    },
    gotRelationsTo : function(){
      var taggingCount = this.model.relationsTo.where({ relation: 'Tagging' }).length;
      jQuery("span#counts", this.el).html(taggingCount); 
      this.context.dispatch("capture:item:gotTagReferences",this.model);
    },
    onItemClick: function(argument) {
      this.context.dispatch("itemSelector:selectedItem", this.model);
    }
  });
});
