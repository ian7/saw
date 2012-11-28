/*global App, Backbone,_,jQuery,JST*/

App.module("main",function(that,App,Backbone,Marionette,jQuery,_,customArgs){
  this.Views.ItemSelectorItem = Backbone.Marionette.CompositeView.extend({
    template: JST['main/itemSelectorItem'],
    events : {
      'click div#item' : 'onItemClick'
    },
    initialize : function() {
      _(this).bindAll();
    },
    onRender : function() {
    },
    onItemClick : function (argument) {
      this.context.dispatch("itemSelector:selectedItem",this.model);
    },
    selected: function( value ){
        if( value ){
          jQuery( this.el ).addClass("red");
        }
        else{
          jQuery( this.el ).removeClass('red');
        }
    }
  });
});