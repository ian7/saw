/*global App,Backbone,JST,_,jQuery */

App.module('resources',function(){
  this.Views.Item = Backbone.Marionette.ItemView.extend({
    template: JST.resourcesItem,
    tagName: 'tr',
    className: 'item',
    events: {
    //  'click div.typeName' : 'onClicked'
    },
    initialize : function(){
      _(this).bindAll();
    }
  });
  this.Views.ItemList = Backbone.Marionette.CompositeView.extend({
    template: JST.resourcesItemList,
    itemView: this.Views.Item,
    itemViewContainer: 'table tr#types',
    collection : new App.Models.Items(),
    events : {
    },
    initialize : function(){
      _(this).bindAll();
      this.itemViewOptions = {context: this.context};
      this.context.listen("type:clicked",this.onTypeClicked);
    },
    onTypeClicked : function(args){
      // this could be done in the model actually....
      this.collection.url  = "/scope/type/"+args.model.get('name');
      this.collection.fetch();
    }
  });
});