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
      this.model.relationsTo.on('reset', this.gotRelationsTo, this);

      this.context.on("typeSelector:selectedTag", this.onSelectedTag, this);
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
    gotRelationsTo: function() {
      var taggingCount = this.model.relationsTo.where({
        relation: 'Tagging'
      }).length;
      jQuery("span#counts", this.el).html(taggingCount);
      this.context.dispatch("capture:item:gotTagReferences", this.model);
      this.updateVisibility();

    },
    onItemClick: function(argument) {
      this.context.dispatch("itemSelector:selectedItem", this.model);
    },
    onSelectedTag: function(tagModel) {
      // go over relations and find what are we related to
      this.lastSelectedTag = tagModel;
      this.updateVisibility();
    },
    updateVisibility: function() {
      if(this.lastSelectedTag) {
        var matches = this.model.relationsTo.where({
          relation: 'Tagging',
          origin: this.lastSelectedTag.get('_id')
        });

        if(matches.length > 0) {
          jQuery(this.el).show();
        } else {
          jQuery(this.el).hide();
        }
      } else {
        jQuery(this.el).show();
      }
    }
  });
});