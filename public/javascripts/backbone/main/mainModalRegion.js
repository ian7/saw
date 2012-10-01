/*global App,Backbone,JST,_,jQuery */

App.module('main',function(){
  this.Regions.Modal = Backbone.Marionette.Region.extend({
      el: "div#modal",

      constructor: function(){
        _.bindAll(this);
        Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);
        this.on("view:show", this.showModal, this);
        this.$el = jQuery(this.el);
      },

      getEl: function(selector){
        var $el = jQuery(selector);
        $el.on("hidden", this.close);
        return $el;
      },

      showModal: function(view){
        view.on("close", this.hideModal, this);
        this.$el.modal('show');
      },

      hideModal: function(){
        this.$el.modal('hide');
      }
    });
});
