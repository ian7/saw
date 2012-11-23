/*global App,Backbone,JST,_,jQuery */

App.module('main',function(){
  this.Regions.Central = Backbone.Marionette.Region.extend({
      el: "div#central",

      constructor: function(){
        _.bindAll(this);
        Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);
        this.$el = jQuery(this.el);
        this.on("view.closed",this.onClosed,this);
      },
      onShow : function( view ){
        this.speedButtons = new App.main.Views.SpeedButtons({
            speedButtons: view.speedButtons,
            context: view.context
          });

        App.main.layout.speedButtonsSidebar.show(this.speedButtons);
        //view.shortcuts[button.shortcut] = button.
        },
      onClosed : function(){
        App.main.layout.speedButtonsSidebar.close();
        }
    });
});
