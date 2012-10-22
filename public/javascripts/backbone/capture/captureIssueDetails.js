/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture",function(){
  this.Views.IssueDetails = Backbone.Marionette.ItemView.extend({
    template: JST['capture/captureIssueDetails'],
    tagName: "div",
    events: {
    },
    templateHelpers: {
        renderAttributeFields : function(){

        }
    },
    initialize: function() {
        _(this).bindAll();
        this.attributesView = new App.main.capture.Views.ItemAttributes({model: this.model });
    },
    onRender : function() {
        this.attributesView.el = this.attributesView.$el = jQuery("div.itemAttributes",this.el);
        this.attributesView.render();
    }
  });
});

