/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.ItemRelationList = Backbone.Marionette.CompositeView.extend({
    template: JST['capture/itemRelationList'],
    className: '',
    itemViewContainer: 'table tbody',
    events: {
    },
    initialize: function( options ) {
      _(this).bindAll();

      this.itemView = App.main.capture.Views.ItemRelationListItem;
      this.itemViewOptions = {context: this.context, relationEnd: options.relationEnd};

      //this.model.relationsTo.on('reset', this.gotRelationsTo, this);

      //this.context.item.relationsFrom.on('reset',this.updateStatus,this);

    },
    onRender: function() {
    }
  });
});
