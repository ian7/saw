/*global App, Backbone,_,jQuery,JST*/


App.module("main.navigate",function(that,App,Backbone,Marionette,jQuery,_,customArgs){

  this.Views.List = Backbone.Marionette.CompositeView.extend({
      template: JST['navigate/list'],
      itemViewContainer: 'div#items',
      events : {
      },
    initialize : function() {
      this.itemView = App.main.navigate.Views.ListItem;
      this.itemViewOptions = {context: this.context};
      // keyboard shortcuts handling

      _(this).bindAll();
    },   
  });
});