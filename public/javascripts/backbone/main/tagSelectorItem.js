/*global App, Backbone,_,jQuery,JST*/

App.module("main",function(that,App,Backbone,Marionette,jQuery,_,customArgs){
  this.Views.TagSelectorItem = Backbone.Marionette.CompositeView.extend({
    template: JST['main/tagSelectorItem'],
    events : {
    },
    initialize : function() {
      _(this).bindAll();

    },
    onRender : function() {
    }
  });
});