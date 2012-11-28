/*global App, Backbone,_,jQuery,JST*/

App.module("main",function(that,App,Backbone,Marionette,jQuery,_,customArgs){
  this.Views.TagSelectorItem = Backbone.Marionette.CompositeView.extend({
    template: JST['main/tagSelectorItem'],
    events : {
      'click span#tag' : 'onClick'
    },
    initialize : function() {
      _(this).bindAll();

    },
    onRender : function() {
    },
    onClick : function(){
        this.context.dispatch("typeSelector:selectedTag",this.model);
    }
  });
});