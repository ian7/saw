/*global App, Backbone,_,jQuery,JST*/

App.module("main",function(that,App,Backbone,Marionette,jQuery,_,customArgs){
  this.Views.TagSelector = Backbone.Marionette.CompositeView.extend({
    template: JST['main/tagSelector'],
    itemViewContainer: 'div#tagList',
    events : {
    },
    shortcuts : {
    },
    speedButtons : {
    },
    initialize : function() {
      _(this).bindAll();

      this.itemView = App.main.Views.TagSelectorItem;
      this.itemViewOptions = {context: this.context};
      this.collection.on('add',this.added,this);
      
    },
    onRender : function() {
        //this.renderCollection();
    },
    added : function() {
        console.log('added');
    }
  });
});