/*global App, Backbone,_,jQuery,JST*/

App.module("main", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.TagListWidgetItem = Backbone.Marionette.ItemView.extend({
    template: JST['main/tagListWidgetItem'],
    tagName: "span",
    className: "tagListWidgetItem",
    events: {},
    shortcuts: {},
    speedButtons: {},
    initialize: function(options) {
      _(this).bindAll();

    },
    render : function(){
      this.tag = this.context.tags.find( function( tag ){
        return( this.model.get('origin') === tag.get('_id') );
      },this);

      if( this.tag ){
        var typeDivEl = jQuery("div.tagType#"+this.tag.get('type')).show();

        var listToAppendEl = jQuery("ul", typeDivEl);

        if( listToAppendEl ){
          listToAppendEl.append( "<li>" + this.tag.get('name') + "</li>" );          
        }
      }
      return true;
    }
  });
});