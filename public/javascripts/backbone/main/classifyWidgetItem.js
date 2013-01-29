/*global App, Backbone,_,jQuery,JST*/

App.module("main", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.ClassifyWidgetItem = Backbone.Marionette.ItemView.extend({
    template: JST['main/classifyWidgetItem'],
// itemViewContainer: 'div#itemList',
    className: 'ClassifyWidget',
    tagName: 'li',
    attributes:  {
      'draggable' : 'true'
    },
    events: {
//      'click div#clearSelection': 'onClearSelection',
//      'click div#relationButtons button.btn' : 'onRelationClicked'
        'dragstart' : 'onDragStart'
    },
    shortcuts: {},
    speedButtons: {
    },
    templateHelpers: {},
    initialize: function( options ) {
      _(this).bindAll();

    },
    onRender : function(){
      jQuery( this.el ).attr('id',this.model.get('id'));
    },
    onDragStart : function( event ){
      event.originalEvent.dataTransfer.setData('id',event.target.id);
    }
  });
});