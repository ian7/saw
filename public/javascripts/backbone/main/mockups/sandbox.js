/*global App, Backbone,_,jQuery,JST*/

App.module("main.mockups",function(){
  this.Views.MockupSandbox = Backbone.Marionette.ItemView.extend({
    tagName : "div",
    template: JST['main/mockups/sandbox'],
    templateHelpers : {
    },
    events : {
    },
    initialize : function(options) {
      _(this).bindAll();
      this.widget = options.widget;
      },
    onRender : function() {
      this.widget.setElement(jQuery("div.widget",this.el));
      this.widget.render();
      }
  });
});