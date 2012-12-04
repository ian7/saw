/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.AlternativeReuse = Backbone.Marionette.CompositeView.extend({
    template: JST['capture/alternativeReuse'],
    itemViewContainer: 'div#itemList',
    events: {
      'click div#clearSelection' : 'onClearSelection'
    },
    shortcuts: {},
    speedButtons: {
        "Issue Details" : {
              color: "orange",
              event: "capture:issues:details",
              shortcut: "ctrl+i"
            },
        "Clear Filter" : {
              color: "red",
              event: "filter:clear",
              shortcut: "esc"
            }
    },
    initialize: function() {
      _(this).bindAll();

      this.itemView = App.main.capture.Views.AlternativeReuseItem;
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
      this.context.on('typeSelector:selectedTag',this.updateItemCount,this);
      this.context.on('filterWidget:filter',this.updateItemCount,this);
      this.context.on('filter:clear',this.onFilterClear,this);

      this.collection.on('add',this.updateItemCount,this);
      this.collection.on('remove',this.updateItemCount,this);

      this.on('composite:model:rendered', this.onModelRendered, this);

    },
    onModelRendered: function() {
      this.typeSelector.setElement(jQuery("div#typeSelector", this.el));
      this.typeSelector.render();
      this.filterWidget.setElement(jQuery('div#filterWidget',this.el));
      this.filterWidget.render();
      this.updateItemCount();

      jQuery("span#issueName",this.el).html(this.context.issue.get('name'));
    },
    updateItemCount : function(){
      jQuery(this.el).oneTime(100,'updatedItemCount',this.delayedUpdateItemCount);
    },
    delayedUpdateItemCount : function(){
      var count = 0;
      _(this.children).each( function( childView ){
        if( jQuery(childView.el).is(':visible')) {
          count = count + 1;
          }
      },this);
      jQuery( "span#matchedItemCount",this.el).html(count);      
    },
    onClearSelection : function(){
      this.context.dispatch('typeSelector:selectedTag',null);
      this.context.dispatch('filterWidget:filter',null);
    },
    onFilterClear : function(){
      this.onClearSelection();
    }
  });
});