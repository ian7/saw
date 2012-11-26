/*global App, Backbone,_,jQuery,JST*/

App.module("main", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.TypeSelectorItem = Backbone.Marionette.CompositeView.extend({
    template: JST['main/mainTypeSelectorItem'],
    events: {
      'click span#name': 'onClick'
    },
    shortcuts: {},
    speedButtons: {},
    initialize: function() {
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
        collection: this.context.tags,
        filter: {
          type: this.model.get('name')
        }
      });
      this.tagSelector = new App.main.Views.TagSelector({
        context: this.context,
        collection: this.tagFilterCollection
      });

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
    },
    updateSubCount: function() {
      jQuery("span#subCount", this.el).first().html("subtypes: " + this.collection.models.length + ", items: " + this.itemCollection.models.length);
    },
    appendHtml: function(cv, iv) {
      var e = jQuery(this.itemViewContainer, cv.$el).first();
      e.append(iv.$el);
    },
    onClick: function() {
      this.context.dispatch('type:selected', this.model);
      // this stops propagation :)
      return false;
    }
  });
});