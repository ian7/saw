/*global App, Backbone,_,jQuery,JST*/

App.module("main",function(that,App,Backbone,Marionette,jQuery,_,customArgs){
  this.Views.TypeSelector = Backbone.Marionette.CompositeView.extend({
    template: JST['main/mainTypeSelector'],
    itemViewContainer : 'div#typeList',
    itemView : App.main.Views.TypeSelectorItem,
    events : {
    },
    shortcuts : {
    },
    speedButtons : {
    },
    initialize : function() {
      _(this).bindAll();
      this.itemView = App.main.Views.TypeSelectorItem;
    },
    onRender : function() {
    }
  });
});