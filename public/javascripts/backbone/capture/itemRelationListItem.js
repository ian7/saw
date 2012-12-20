/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.ItemRelationListItem = Backbone.Marionette.CompositeView.extend({
    template: JST['capture/itemRelationListItem'],
    className: '',
    tagName: 'tr',
    events: {
    },
    initialize: function( options ) {
      _(this).bindAll();
      this.relationEnd = options.relationEnd;

      this.itemModel = new App.Data.Item();
      this.itemModel.id = this.model.get(this.relationEnd);
      this.itemModel.fetch();

      this.subView = new App.main.Views.ItemAttributeWidget({
        context: this.context,
        model: this.itemModel,
        attribute: 'name'
      });  
    },
    onRender: function() {
      this.subView.setElement( jQuery( "td#subItem",this.el ));
      this.subView.render();
    }
  });
});
