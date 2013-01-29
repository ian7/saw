/*global App, Backbone,_,jQuery,JST*/

App.module("main", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.NotificationListWidgetItem = Backbone.Marionette.ItemView.extend({
    template: JST['main/notificationListWidgetItem'],
    tagName: "tr",
    className: "notificationListWidgetItem",
    events: {},
    shortcuts: {},
    speedButtons: {},
    initialize: function(options) {
      _(this).bindAll();

    }
  });
});