/*global App, Backbone,_,jQuery,JST*/

App.module("main", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.TagListWidgetItem = Backbone.Marionette.ItemView.extend({
    template: JST['main/tagListWidgetItem'],
    tagName: "span",
    className: "tagListWidgetItem",
    events: {
      'click': 'onClickTagName'
    },
    shortcuts: {},
    speedButtons: {},
    initialize: function(options) {
      _(this).bindAll();

    },
    render : function(){
      this.tag = App.main.context.tags.find( function( tag ){
        return( this.model.get('origin') === tag.get('id') );
      },this);

      if( this.tag ){
        var typeDivEl = jQuery("div.tagType#"+this.tag.get('type')).show();

        var listToAppendEl = jQuery("ul", typeDivEl);

        if( listToAppendEl ){
          var found = jQuery("li#"+this.tag.get('id'),listToAppendEl);
          
          if( found.length === 0 ) {
              listToAppendEl.append( "<li id='" + this.tag.get('id') + "' class='tagId'>" + this.tag.get('name') + "</li>" );          
          }
        }
      }
      this.delegateEvents();
      return false;
    },
    onClose : function(){

      if( this.tag ) {
        var tagEl = jQuery("li#"+this.tag.get('id'));
        
        var tagTypeEl = tagEl.parent();
        
        tagEl.remove();
        
        if( tagTypeEl.children().length === 0 ){
            tagTypeEl.parent().hide();
        }
      }      
    },
    onClickTagName : function(){
      this.context.dispatchGlobally("tagListWidget:tagSelected",this.tag);
    }
  });
});