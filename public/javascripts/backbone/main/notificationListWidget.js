/*global App, Backbone,_,jQuery,JST,eventer*/

App.module("main", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.NotificationListWidget = Backbone.Marionette.CompositeView.extend({
    template: JST['main/notificationListWidget'],
    itemViewContainer: 'table#notifications tbody',
    tagName: "div",
    className: "notificationListWidget",
    events: {
    },
    shortcuts: {},
    speedButtons: {},
    initialize: function(options) {
      _(this).bindAll();

      this.itemView = App.main.Views.NotificationListWidgetItem;
      this.itemViewOptions = {
        context: this.context
      };

      this.collection = new Backbone.Collection();

      eventer.register(this);
    },
    onRender: function() {
    },

    notifyEvent : function( data ) {
      var notification = JSON.parse(data);
      
      // this should stop collection from eliminating duplicates... ugly but works. 
      notification.itemID = notification.id;
      notification.id = notification.id+(new Date().getTime()).toString();

      var model = new Backbone.Model( notification );
      this.collection.add(model);


      if( this.collection.length > 20 ){
        this.collection.shift();
      }
    }
  });
});