/*global App,Backbone,JST */

App.module('resources',function(){
  this.Views.Type = Backbone.Marionette.ItemView.extend({
    template: JST.resourcesType,
    tagName: 'td',
    className: 'typeName',
    events: {

    },
    onRender : function(){
      //debugger;
    }
  });
  this.Views.TypeList = Backbone.Marionette.CompositeView.extend({
    template: JST.resourcesTypeList,
    itemView: this.Views.Type,
    itemViewContainer: 'table tr#types',
    events : {
    //    "keyup input.searchBox" : "searchBoxEdited",
    },
//    collection : new App.Models.Types(),
    initialize : function(){
      //debugger;
      Backbone.Marionette.Geppetto.bindContext({
        view: this,
        context: App.resources.context
      });
      this.collection = this.context.types;
    },
    onRender : function(){
//      this.collection.fetch();
    }
  });
});