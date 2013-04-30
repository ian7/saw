/*global App, Backbone,_,jQuery,JST*/


App.module("main.navigate",function(that,App,Backbone,Marionette,jQuery,_,customArgs){

  this.Views.List = Backbone.Marionette.CompositeView.extend({
      template: JST['navigate/list'],
      itemViewContainer: 'div#items',
      events : {
      },
    initialize : function( options ) {
      this.direction = options.direction;
      this.itemView = App.main.navigate.Views.ListItem;
      this.itemViewOptions = {
        context: this.context,
        direction: this.direction
      };
      // keyboard shortcuts handling

      _(this).bindAll();
    },   
  });
});