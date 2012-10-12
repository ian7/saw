/*global App,Backbone,JST,_,jQuery */

App.module('resources',function(){
  this.Views.Item = Backbone.Marionette.ItemView.extend({
    template: JST['resources/resourcesItem'],
    tagName: 'tr',
    className: 'item',
    events: {
    //  'click div.typeName' : 'onClicked'
      "click div.expand": "toggleExpand", 
      "click"           : "expand"
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
    },
    onRender : function(){
    },
    toggleExpand : function(){
    },
    expand : function(){
      // brief information taken from the scope can be enhanced 
      // by loading data (information about relations) from the /r/ resource 
      this.model.url = this.model.get('url');
      this.model.fetch();
      this.relationsView = new App.resources.Views.RelatedItems({model: this.model, el: jQuery('section.subItem',this.el)});
    }
  });

  this.Views.RelatedItems = Backbone.Marionette.CompositeView.extend({
  events: {
       "click .pivot": "pivot"
  },
    initialize: function() {
      _(this).bindAll('render');
      this.model.bind('change', this.render);
    },
    
    render: function() {
//        this.el.innerHTML = JST.relations_show({relative: this.model });
        var e="<table width=100%><tr><th with=50%>Related to:</th><th width=50%>Related from:</th><tr>";
        e+="<td><ul>";
        for( rel_to in this.model.attributes.related_to ){
          e+="<li>"+
            " <div class=\"pivot\" id=\""+
              this.model.attributes.related_to[rel_to].type +
              "/" +
              this.model.attributes.related_to[rel_to]._id +
              "\">" +
            "<b>" +
            this.model.attributes.related_to[rel_to].type +
            "</b>: " +          
            this.model.attributes.related_to[rel_to].name +
            "</div>" +
            "</li>";

        };
        e+="</ul></td>";

        e+="<td><ul>";
        for( rel_to in this.model.attributes.related_from ){
          e+="<li>"+
            " <div class=\"pivot\" id=\""+
              this.model.attributes.related_from[rel_to].type +
              "/" +
              this.model.attributes.related_from[rel_to]._id +
              "\">" +
            "<b>" +
            this.model.attributes.related_from[rel_to].type +
            "</b>: " +          
            this.model.attributes.related_from[rel_to].name +
            "</div></li>";
        }
        e+="</ul></td></tr></table>";

        this.el.innerHTML=e;
         jQuery(this.el).hide();
         jQuery(this.el).slideDown(200);
                
        return this;
    },
    pivot: function( e ){
     //   App.Components.Rs.navigate(e.target.id,{trigger: true});
    }
 });
  /* for some reason emptyView property doesn't work as it should... no patience do debug it now */
  this.Views.EmptyItem = Backbone.Marionette.ItemView.extend({
    tagName: 'tr',
    className: 'item',
    template: '<center>(empty list)</center>'
  });

  this.Views.ItemList = Backbone.Marionette.CompositeView.extend({
    template: JST['resources/resourcesItemList'],
    itemView: this.Views.Item,
    emptyView: this.Views.EmptyItem,
    itemViewContainer: 'table.list',
    collection : new App.Models.Issues(),
    events : {
    },
    initialize : function(){
      _(this).bindAll();
      this.itemViewOptions = {context: this.context};
      this.context.listen("type:clicked",this.onTypeClicked);
    },
    onTypeClicked : function(args){
      // this could be done in the model actually....
      this.collection.reset();
      this.showSpinner();
      this.collection.url  = "/scope/type/"+args.model.get('name');
      this.collection.fetch();
    },
    showSpinner : function(){
      jQuery("div.spinner",this.el).show();
    },
    onRender : function(){
      jQuery("div.spinner",this.el).hide();      
    }
  });


});