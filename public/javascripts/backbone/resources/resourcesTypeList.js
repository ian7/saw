/*global App,Backbone,JST,_,jQuery */

App.module('resources',function(){
  this.Views.Type = Backbone.Marionette.ItemView.extend({
    template: JST['resources/resourcesType'],
    tagName: 'td',
    className: 'typeName',
    events: {
      'click div.typeName' : 'onClicked'
    },
    initialize : function(args){
      _(this).bindAll();
      this.context = args.context;
      this.context.listen("type:clicked",this.onClickedEvent);
    },
    onRender : function(){
      //debugger;
    },
    onClicked : function(){
      //alert(this.model.get('name'));
      this.context.dispatch('type:clicked',{model:this.model});
    },
    onClickedEvent : function(a){
      //console.log('received');
      if( a.model.get('_id') === this.model.get('_id') ){
          jQuery(this.el).addClass('bold');
      }
      else {
          jQuery(this.el).removeClass('bold');
      }
    }
  });
  this.Views.TypeList = Backbone.Marionette.CompositeView.extend({
    template: JST['resources/resourcesTypeList'],
    itemView: this.Views.Type,
    itemViewContainer: 'table tr#types',
    events : {
    //    "keyup input.searchBox" : "searchBoxEdited",
    },
//    collection : new App.Models.Types(),
    initialize : function(){
      //debugger;
      /* Backbone.Marionette.Geppetto.bindContext({
        view: this,
        context: App.resources.context
      });*/
      this.collection = this.context.types;
      this.itemViewOptions = {context: this.context};
    }
  });
});