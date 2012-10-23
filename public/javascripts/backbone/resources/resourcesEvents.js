/*global App,Backbone,JST,_,jQuery */

App.module('main.resources',function(){
  this.Views.Events = Backbone.Marionette.CompositeView.extend({
  template: JST['resources/resourcesEvents'],
  itemView: App.main.resources.Views.EventsItem,
  templateHelpers : {
    renderAttributes: function(){
      var attributes = ['itemId','event','user','type','distance','class'];
      var h = "";
      for( var attributeId in attributes ){
        h += "<th> "+ attributes[attributeId] + "</th>";
      }
      return h;
    },
  },
  events : {
    'click div#clear': 'clear',
  },
  initialize : function() {
    _(this).bindAll();
  
    this.collection = new Backbone.Collection();
    // due to messy loading procedure this needs to be initialized here:
    this.itemView = App.main.resources.Views.EventsItem;

    eventer.register(this);
  },
  notifyEvent : function( data ) {
    e = JSON.parse(data)
    e.itemId = e.id;
    e.id = e.id+(new Date().getTime()).toString();

//    console.log("Event_log caught id:"+e.itemId);
      this.collection.add(e);

  },
  clear : function(){
    this.collection.reset();
  },
  appendHtml: function(collectionView, itemView){
    jQuery(collectionView.$("table tbody")[0]).prepend(itemView.el);
  }
  });
});