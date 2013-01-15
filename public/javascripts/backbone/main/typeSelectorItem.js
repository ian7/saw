/*global App, Backbone,_,jQuery,JST*/

App.module("main", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.TypeSelectorItem = Backbone.Marionette.CompositeView.extend({
    template: JST['main/typeSelectorItem'],
    events: {
      'click span#name': 'onClick'
    },
    className: 'typeSelectorItem',
    shortcuts: {},
    speedButtons: {},
    initialize: function( options ) {
      _(this).bindAll();
      // set itemView to itself
      this.itemView = App.main.Views.TypeSelectorItem;
      // pass the context
      this.itemViewOptions = {
        context: this.context
      };
      this.itemViewContainer = "div#subItems";

      // and set the collection
      this.collection = new Backbone.CollectionFilter({
        collection: App.main.context.types
      });
      this.collection.on('add', this.updateSubCount, this);
      this.collection.on('remove', this.updateSubCount, this);


      this.itemCollection = new Backbone.CollectionFilter({
        collection: App.main.context.tags
      });
      this.itemCollection.on('add', this.updateSubCount, this);
      this.itemCollection.on('remove', this.updateSubCount, this);

      this.tagFilterCollection = new Backbone.CollectionFilter({
        collection: App.main.context.tags,
        filter: {
          type: this.model.get('name')
        }
      });
      this.tagSelector = new App.main.Views.TagSelector({
        context: this.context,
        collection: this.tagFilterCollection
      });
      
      this.context.on("capture:item:gotTagReferences", this.updateTagItemCounts,this);

      this.on('composite:rendered', this.modelRendered, this);

    },
    modelRendered: function() {
      this.collection.setFilter({
        super_type: this.model.get('name')
      });
      this.itemCollection.setFilter({
        type: this.model.get('name')
      });
      this.updateSubCount();

      // render tags
      this.tagSelector.setElement( jQuery( "div#items",this.el ).first() );
      this.tagSelector.render();  

      // hide tag list...
      jQuery( "div#items",this.el).hide();
    },
    updateSubCount: function() {
      jQuery("span#subCount", this.el).first().html("subtypes: " + this.collection.models.length + ", items: " + this.itemCollection.models.length);
    },
    updateTagItemCounts : function(){
      var relatedItemsCount = this.tagSelector.getRelatedItemsCount();
      if( relatedItemsCount > 0 ){
        jQuery(this.el).show();
      }else{
        jQuery(this.el).hide();
      }
    },
    appendHtml: function(cv, iv) {
      var e = jQuery(this.itemViewContainer, cv.$el).first();
      e.append(iv.$el);
    },
    onClick: function() {
      this.context.dispatch('type:selected', this.model);
      // toggle show items
      if( jQuery( "div#items",this.el).is(':visible')) {
          jQuery("div#items",this.el).hide();
      } else {
          jQuery("div#items",this.el).show();
      }

      jQuery("div.typeSelectorItem").removeClass('red');
      jQuery(this.el).addClass('red');

      // this stops propagation :)
      return false;
    }
  });
});