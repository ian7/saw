/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.ItemRelate = Backbone.Marionette.CompositeView.extend({
    template: JST['capture/itemRelate'],
    itemViewContainer: 'div#itemList',
    events: {
      'click div#clearSelection': 'onClearSelection',
      'click div#relationButtons button.btn' : 'onRelationClicked'
    },
    shortcuts: {},
    speedButtons: {
      "Clear Filter": {
        color: "red",
        event: "filter:clear",
        shortcut: "esc"
      }
    },
    templateHelpers: {},
    initialize: function() {
      _(this).bindAll();

      this.itemView = App.main.capture.Views.ItemRelateItem;
      this.itemViewOptions = {
        context: this.context
      };

      var types = new Backbone.CollectionFilter({
        collection: this.context.parentContext.types,
        filter: {
          super_type: "Tag"
        }
      });

      this.typeSelector = new App.main.Views.TypeSelector({
        context: this.context,
        collection: types,
        options: {
          hideEmpty: true
        }
      });

      this.filterWidget = new App.main.Views.FilterWidget({
        context: this.context
      });
      this.context.on('typeSelector:selectedTag', this.updateItemCount, this);
      this.context.on('filterWidget:filter', this.updateItemCount, this);
      this.context.on('itemRelate:relationSelected',this.updateItemCount,this);
      this.context.on('filter:clear', this.onFilterClear, this);

      this.context.on('itemRelate:relationSelected',this.onRelationSelected,this);

      this.collection.on('add', this.updateItemCount, this);
      this.collection.on('remove', this.updateItemCount, this);

      this.on('composite:model:rendered', this.onModelRendered, this);

      this.acceptableRelations = _(this.context.parentContext.types.models).filter(function(type) {
        var found = false;

        if(!type.isA("Relation")) {
          return false;
        }

        _(type.get('scopes')).each(function(scope) {
          if(this.context.item.get('type') === scope.domain) {
            found = true;
          }
        }, this);
        return found;
      }, this);

      // this makes the item to take care about its relations
      this.context.item.updateRelationsFrom = true;
      this.context.item.getRelationsFrom();

    },
    onModelRendered: function() {
      this.typeSelector.setElement(jQuery("div#typeSelector", this.el));
      this.typeSelector.render();
      this.filterWidget.setElement(jQuery('div#filterWidget', this.el));
      this.filterWidget.render();
      this.updateItemCount();
      
      jQuery("span#itemType", this.el).html(this.context.item.get('type'));
      jQuery("span#itemName", this.el).html(this.context.item.get('name'));
      this.renderRelationButtons();
    },
    renderRelationButtons: function() {
      var h = "";

      _(this.acceptableRelations).each(function(relation) {
        h += "<button class='btn' id='" + relation.get('name') + "'>" + relation.get('name') + "</button>";
      }, this);
      h += "";

      jQuery("div#relationButtons", this.el).html(h);
      jQuery("div#relationButtons").buttonset();
    },
    onRelationClicked: function( event ){
      var relation = this.context.parentContext.types.find(function(type){ return type.get('name') == event.target.id;});
      this.context.dispatch("itemRelate:relationSelected",relation );
    },
    onRelationSelected : function( relation ){
      jQuery("div#relationButtons button.btn",this.el).removeClass('btn-success');

      if( relation ){
        jQuery("div#relationButtons button.btn#"+relation.get('name')).addClass("btn-success");
      }
    },
    updateItemCount: function() {
      jQuery(this.el).oneTime(100, 'updatedItemCount', this.delayedUpdateItemCount);
    },
    delayedUpdateItemCount: function() {
      var count = 0;
      _(this.children).each(function(childView) {
        if(jQuery(childView.el).is(':visible')) {
          count = count + 1;
        }
      }, this);
      jQuery("span#matchedItemCount", this.el).html(count);
    },
    onClearSelection: function() {
      this.context.dispatch('typeSelector:selectedTag', null);
      this.context.dispatch('filterWidget:filter', null);
      this.context.dispatch('itemRelate:relationSelected',null);
    },
    onFilterClear: function() {
      this.onClearSelection();
    }
  });
});