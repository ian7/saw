/*global App, Backbone,_,jQuery,JST*/

App.module("main", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.NotificationListWidgetRequestFocus = Backbone.Marionette.ItemView.extend({
    template: JST['main/notificationListWidgetRequestFocus'],
    tagName: "tr",
    className: "notificationListWidgetItem",
    events: {
      "mouseover" : 'onHover',
      "click" : 'onClick'
    },
    shortcuts: {},
    speedButtons: {},
    initialize: function(options) {
      _(this).bindAll();
      this.itemModel = new App.Data.Item();
      this.itemModel.on('change',this.onItemModelChange,this);
      this.itemModel.on('reset',this.onItemModelChange,this);
    },
    onRender : function(){
      jQuery(this.el).popover({
            trigger: 'hover',
            title: this.model.get('type'),
            content: this.getContent,
            placement: 'left'
      });
    },
    getContent : function(){
        if( this.itemModel.isNew() ){
            return( "..." );
        }
        else{
            return( this.itemModel.get(this.itemModel.get('name')));
        }
    },
    onHover : function(){
      if( this.itemModel.isNew() ){
        this.itemModel.id = this.model.get('itemID');
        this.itemModel.fetch();
      }
    },
    onItemModelChange : function(){
      jQuery("div.popover div.popover-content p").html(this.itemModel.get('name'));
    },
    onClick : function(){
      this.itemModel.notify({hoho:'hihi'});
      //jQuery.post('/r/' + this.model.get('id') + '/notify', "{\"hoho\":\"hihi\"}", function( data ){});
    }
  });
});