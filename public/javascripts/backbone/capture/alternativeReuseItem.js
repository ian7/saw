/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.AlternativeReuseItem = Backbone.Marionette.CompositeView.extend({
    template: JST['capture/alternativeReuseItem'],
    className: 'minHeight padding1em',
    events: {
      'click div#item': 'onItemClick',
      'click div#toggleReuse': 'onToggleReuse'
    },
    initialize: function() {
      _(this).bindAll();
      this.updateStatus();
      this.context.issue.alternatives.on('add', this.updateStatus, this);
      this.context.issue.alternatives.on('remove', this.updateStatus, this);
      this.context.issue.alternatives.on('reset', this.updateStatus, this);
      this.model.relationsTo.on('reset', this.gotRelationsTo, this);

      this.context.on("typeSelector:selectedTag", this.onSelectedTag, this);
      this.context.on('filterWidget:filter', this.onFilterChange, this);
    },
    onRender: function() {
      this.model.getRelationsTo();
      this.updateStatus();
    },
    updateStatus: function() {
      if(!this.context.issue.alternatives) {
        throw new Error("Issue has no loaded alternatives");
      }

      if(this.context.issue.alternatives.get(this.model.get('id'))) {
        jQuery("span#status", this.el).html("found");
        jQuery("div#toggleReuse", this.el).removeClass('gray green').addClass('red').html('Exclude');
      } else {
        jQuery("span#status", this.el).html("absent");
        jQuery("div#toggleReuse", this.el).removeClass('gray red').addClass('green').html('Reuse');
      }
    },
    onToggleReuse: function() {
      if(jQuery("div#toggleReuse", this.el).hasClass("gray")) {
        return;
      }

      jQuery("div#toggleReuse", this.el).removeClass('green red').addClass('gray').html('...');
      // finding this issue in the list of the project issues is decisive on whenever it belongs to the project or not
      if(this.context.issue.alternatives.get(this.model.get('id'))) {
        // if it belongs
        //this.model.untag( this.context.parentContext.project);
        this.context.issue.unrelate({
          relation: "SolvedBy",
          item: this.model
        });
      } else {
        // if it doesn't belong
        //this.model.tag( this.context.parentContext.project);
        this.context.issue.relate({
          relation: "SolvedBy",
          item: this.model
        });
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
    onFilterChange: function(filterText) {
      this.lastFilterText = filterText;
      this.updateVisibility();
    },
    updateVisibility: function() {
      var show = true;

      if(this.lastSelectedTag) {
        var matches = this.model.relationsTo.where({
          relation: 'Tagging',
          origin: this.lastSelectedTag.get('_id')
        });

        if(matches.length === 0) {
          show = false;
        }
      }

      if(this.lastFilterText) {
        if(this.model.get('name') == null || this.model.get('name') === "") {
          show = false;
        }
        if(this.model.get('name') && this.model.get('name').match(this.lastFilterText) === null) {
          show = false;
        }
      }

      if(show === true) {
        jQuery(this.el).show();
      } else {
        jQuery(this.el).hide();
      }

    }
  });
});