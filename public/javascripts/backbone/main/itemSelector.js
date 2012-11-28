/*global App, Backbone,_,jQuery,JST*/

App.module("main",function(that,App,Backbone,Marionette,jQuery,_,customArgs){
  this.Views.ItemSelector = Backbone.Marionette.CompositeView.extend({
    template: JST['main/itemSelector'],
    itemViewContainer: 'div#itemList',
    events : {
    },
    shortcuts : {
    },
    speedButtons : {
    },
    initialize : function() {
      _(this).bindAll();
      
      this.itemView = App.main.Views.ItemSelectorItem;
      this.itemViewOptions = { context: this.context };

      var types = new Backbone.CollectionFilter( { collection: this.context.types, filter: { super_type: "Tag" }  });
      
      this.typeSelector = new App.main.Views.TypeSelector( { context: this.context, collection: types } );
      this.collection = this.context.issues;

      this.context.on('itemSelector:selectedItem',this.onItemSelected,this);
      this.context.on('typeSelector:selectedTag',this.onTagSelected,this);
    },
    onRender : function() {
      this.typeSelector.setElement( jQuery( "div#typeSelector",this.el ) );
      this.typeSelector.render();
    },
    onItemSelected : function(item){
        jQuery("span#itemName",this.el).html(item.get('name'));
    },
    onTagSelected : function(item){
        jQuery("span#tagName",this.el).html(item.get('name'));        
    }
  });
});