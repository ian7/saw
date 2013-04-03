/*global App, Backbone,_,jQuery,JST*/

App.module("main", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.TaggingWidget = Backbone.Marionette.CompositeView.extend({
    template: JST['main/taggingWidget'],
    itemViewContainer: 'div#itemList',
    className: 'TaggingWidget',
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
        filterParams: {
          type: this.model.get('type')
        },
        filterFunction : function( type ){
          // if it is not a tag, then just ignore it.
          if( !type.isA("Tag") ){
            return false;
          }

          var found = _(type.get('scopes')).find(function( scope ){
            return (scope.scope === this.filterParams.type);
          },this);
          
          if( found ){
              return true;
          }
          else {
              return false;
          }
        }
      });

      // let's switch on observing mode ;)
      this.model.updateRelationsTo = true; 

      this.nowTagged = new Backbone.CollectionFilter({
        collection: this.model.relationsTo,
        filterFunction: function( relation ){
            var tag = App.main.context.tags.find( function( tag ){
              return( tag.get('id') === relation.get('origin') );
            },this);
            if( tag ) {
                return true;
            }
            else{
                return false;
            }
        }
      });

      this.collection = new Backbone.CollectionFilter({
        collection: App.main.context.tags,
        filterParams: {
            types: types
            },
        filterFunction: function( tag ){
          return( this.filterParams.types.find( function( type ){
              return( type.get('name') === tag.get('type') );
            },this)
          );
        }
      });
      
      
      this.typeSelector = new App.main.Views.TypeSelector({
        context: this.context,
        collection: types,
        hideEmpty: false,
        taggedItemsCollection: this.collection

      });

      this.filterWidget = new App.main.Views.FilterWidget({
        context: this.context
      });
      this.context.on('type:selected', this.updateItemCount, this);
      this.context.on("type:selected", this.onTypeSelected, this);
      this.context.on('filterWidget:filter', this.updateItemCount, this);
      this.context.on('itemRelate:relationSelected',this.updateItemCount,this);
      this.context.on('filter:clear', this.onFilterClear, this);

      this.context.on('itemRelate:relationSelected',this.onRelationSelected,this);
    
      this.collection.on('add', this.updateItemCount, this);
      this.collection.on('remove', this.updateItemCount, this);

      this.on('composite:model:rendered', this.onModelRendered, this);

     
    },
    onTypeSelected: function( type ){
      jQuery("div#tagList",this.el).hide();
    },
    onModelRendered: function() {
      this.typeSelector.setElement(jQuery("div#typeSelector", this.el));
      this.typeSelector.render();
      this.filterWidget.setElement(jQuery('div#filterWidget', this.el));
      this.filterWidget.render();
      this.updateItemCount();
      
      jQuery("span#itemType", this.el).html(this.model.get('type'));
      jQuery("span#itemName", this.el).html(this.model.get('name'));


      // let's hide tags
      this.onTypeSelected();
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