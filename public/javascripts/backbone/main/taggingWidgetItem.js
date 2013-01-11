/*global App, Backbone,_,jQuery,JST*/

App.module("main", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.TaggingWidgetItem = Backbone.Marionette.CompositeView.extend({
    template: JST['main/taggingWidgetItem'],
    className: '',
    tagName: 'tr',
    events: {
      'click td#tagName' : 'onNameClicked'
    },
    initialize: function( options ) {
      _(this).bindAll();
      this.context.on("type:selected",this.onTagSelected,this);
      this.item = options.item;
      this.item.relationsTo.on('add',this.render,this);
      this.item.relationsTo.on('remove',this.render,this);
    },
    onRender: function() {
      
      var tagButtonEl = jQuery("td#tagButton",this.el);
      
      if( this.isTagged() ){
        tagButtonEl.html("tagged");
      }
      else{
        tagButtonEl.html("not tagged");
      }
    },
    onNameClicked : function(){
      var relation = this.isTagged();
      if( relation ){
        this.item.untag(this.model);
      }
      else{
        this.item.tag(this.model);
      }
    },
    onTagSelected : function( tagType ){
      if( this.model.get('type') === tagType.get('name') ){
        jQuery(this.el).show();
      }
      else{
        jQuery(this.el).hide();
      }
    },
    isTagged : function(){
      var relation = this.item.relationsTo.find( function( relation ){
        return( relation.get('origin') === this.model.get('id') );
      },this);

      return( relation );
    }
  });
});
