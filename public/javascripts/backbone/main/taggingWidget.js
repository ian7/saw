/*global App, Backbone,_,jQuery,JST*/

App.module("main", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.TaggingWidget = Backbone.Marionette.CompositeView.extend({
    template: JST['main/taggingWidget'],
    itemViewContainer: 'div#itemList',
    events: {
//      'click div#clearSelection': 'onClearSelection',
//      'click div#relationButtons button.btn' : 'onRelationClicked'
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

      this.itemView = App.main.Views.TaggingWidgetItem;
      this.itemViewOptions = {
        context: this.context,
        item: this.model
      };

      var types = new Backbone.CollectionFilter({
        collection: this.context.types,
        filter: {
          super_type: "Tag"
        }
      });

      // let's switch on observing mode ;)
      this.model.updateRelationsTo = true; 

      this.nowTagged = new Backbone.CollectionFilter({
        collection: this.model.relationsTo,
        filterFunction: function( relation ){
            var tag = App.main.context.tags.find( function( tag ){
              return( tag.get('id') === relation.get('origin') )
            },this);
            if( tag ) {
                return true;
            }
            else{
                return false;
            }
        }
      });

      this.collection = App.main.context.tags;
      
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

     
    },
    onModelRendered: function() {
      this.typeSelector.setElement(jQuery("div#typeSelector", this.el));
      this.typeSelector.render();
      this.filterWidget.setElement(jQuery('div#filterWidget', this.el));
      this.filterWidget.render();
      this.updateItemCount();
      
      jQuery("span#itemType", this.el).html(this.model.get('type'));
      jQuery("span#itemName", this.el).html(this.model.get('name'));
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