/*global App, Backbone,_,jQuery,JST*/

App.module("main", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.ItemAttributeWidget = Backbone.View.extend({
    events: {
    },
    initialize: function( options ) {
      _(this).bindAll();
      this.attribute = options.attribute;

      this.model.on( 'change',this.onRender,this );
    },
    onRender: function() {
      var h="";
      h += "<span>";
      h += this.model.get( this.attribute );
      h += "</span>";
      jQuery(this.el).html(h);
    }
  });
});
