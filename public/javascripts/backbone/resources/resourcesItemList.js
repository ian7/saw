/*global App,Backbone,JST,_,jQuery */

App.module('resources',function(){
  this.Views.Item = Backbone.Marionette.ItemView.extend({
    template: JST.resourcesItem,
    tagName: 'tr',
    className: 'item',
    events: {
    //  'click div.typeName' : 'onClicked'
    },
    templateHelpers : {
      renderAttributes : function(){
        var attribtue = "";
        var h="";
        _(this.attributes).each( function(value,attribute){
          // some attributes aren't really worth mentioning...
          var lameAttributes = ['renderAttributes','url','type','id','related_from','related_to','undefined'];

          if( _(lameAttributes).indexOf( attribute ) === -1 ){
            h +="<tr>";
              h += "<td class=\"attributeName\">" + attribute +"</td>";
              h += "<td class=\"attributeValue editable\" contenteditable=\"true\" id=\""+ attribute +"\">" 
                + value
                + "</td>";
            h+="</tr>";            
          }
        },this);
      return h;
      }
    },
    initialize : function(){
      _(this).bindAll();
    }
  });

  this.Views.ItemList = Backbone.Marionette.CompositeView.extend({
    template: JST.resourcesItemList,
    itemView: this.Views.Item,
    itemViewContainer: 'div.list',
    collection : new App.Models.Items(),
    events : {
    },
    initialize : function(){
      _(this).bindAll();
      this.itemViewOptions = {context: this.context};
      this.context.listen("type:clicked",this.onTypeClicked);
    },
    onTypeClicked : function(args){
      // this could be done in the model actually....
      this.collection.url  = "/scope/type/"+args.model.get('name');
      this.collection.fetch();
    }
  });
});