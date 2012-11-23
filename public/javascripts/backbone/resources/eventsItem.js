/*global App,Backbone,JST,_,jQuery */

App.module('main.resources',function(){
  this.Views.EventsItem= Backbone.Marionette.ItemView.extend({
  template: JST['resources/eventsItem'],
  tagName: 'tr',
  className: 'eventNotification',
  templateHelpers: {
    renderAttributes : function(){
      var attributes = ['itemId','event','user','type','distance','class'];
      var h  = "";
      for( var attributeId in attributes ){
        h += this.renderAttr( attributes[attributeId] );
      }
      return( h );
    },
    renderAttr : function( attrName ){
      r = "<td>";
      r += this.get( attrName );
      r += "</td>";
      return r;
    },

  },
  initialize : function(){
     _(this).bindAll();
  }
});
});