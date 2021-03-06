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

      // let's pass collection of items that are actually tagged:
      this.taggedItemsCollection = options.taggedItemsCollection;

      this.hideEmpty = options.hideEmpty;

      this.itemViewOptions = {
        context: this.context,
        taggedItemsCollection: this.taggedItemsCollection
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
        taggedItemsCollection:  this.taggedItemsCollection,
        collection: this.tagFilterCollection,
        hideEmpty: this.hideEmpty
      });
      
      //this.context.on("capture:item:gotTagReferences", this.updateTagItemCounts,this);
      this.taggedItemsCollection.on('add',this.updateTagItemCounts,this);      
      this.taggedItemsCollection.on('remove',this.updateTagItemCounts,this);
      this.on('composite:rendered', this.modelRendered, this);
    
      this.context.on('typeSelector:selectedTag',this.onSelectedTag,this);

      this.context.on('filter:clear', this.onFilterClear, this);

    },
    onSelectedTag : function( tag ){
      if( tag && tag.get('type') === this.model.get('name') ){
        this.onSelected();
      }
      else {
        this.onUnselected();
      }
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
      if( this.hideEmpty ){
       jQuery( "div#items",this.el).hide();
      }
      this.updateTagItemCounts();
    },
    updateSubCount: function() {
      jQuery("span#subCount", this.el).first().html("subtypes: " + this.collection.models.length + ", items: " + this.itemCollection.models.length);
    },
    updateTagItemCounts : function(){
      var relatedItemsCount = this.tagSelector.getRelatedItemsCount();
      if( relatedItemsCount > 0 || !this.hideEmpty ){
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
      // toggle show items
      if( jQuery( "div#items",this.el).is(':visible')) {
        this.onUnselected();
      } else {
        this.onSelected();
      }
      // this needs to stop further propagation
      return false;
    },
    onSelected: function(){
      this.context.dispatch('type:selected', this.model);
//      jQuery("div#items",this.el).hide();
      jQuery("div#items",this.el).show();
    },
    onUnselected: function(){
      jQuery("div#items",this.el).hide();
      jQuery("span#name",this.el).removeClass('red');
    }
  });
});