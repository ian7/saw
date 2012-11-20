/*global App, Backbone,_,jQuery,JST*/

App.module("main.mockups",function(){
  this.Views.MockupSandbox = Backbone.Marionette.ItemView.extend({
    tagName : "div",
    template: JST['main/mockups/mockupsSandbox'],
    templateHelpers : {
    },
    events : {
    },
    initialize : function(options) {
      _(this).bindAll();
      this.widgetInstance = new options.widget({context: this.context});
      },
    onRender : function() {
      this.widgetInstance.setElement(jQuery("div.widget",this.el));
      this.widgetInstance.render();
      }
  });
});