/*global App, Backbone,_,jQuery,JST*/

App.module("main", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.TypeSelector = Backbone.Marionette.CompositeView.extend({
    template: JST['main/typeSelector'],
    itemViewContainer: 'div#typeList',
    // set in initializer
    itemView: null,
    events: {},
    shortcuts: {},
    speedButtons: {},
    initialize: function(options) {
      _(this).bindAll();
      this.itemView = App.main.Views.TypeSelectorItem;

      this.taggedItemsCollection = options.taggedItemsCollection;
      this.hideEmpty = options.hideEmpty;

      this.itemViewOptions = {
        context: this.context,
        taggedItemsCollection: options.taggedItemsCollection,
        hideEmpty: this.hideEmpty
      };
    },
    onRender: function() {}
  });
});