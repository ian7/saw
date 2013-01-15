/*global App, Backbone,_,jQuery,JST*/

App.module("main", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.TaggingWidgetItem = Backbone.Marionette.CompositeView.extend({
    template: JST['main/taggingWidgetItem'],
    className: 'taggingListWidgetItem',
    tagName: 'div',
    events: {
      'click td#tagName' : 'onNameClicked',
      'click div.button' : 'onNameClicked'
    },
    initialize: function( options ) {
      _(this).bindAll();
      this.context.on("type:selected",this.onTagSelected,this);
      this.context.on('filterWidget:filter',this.onFilterSet,this);
      this.item = options.item;
      this.item.relationsTo.on('add',this.render,this);
      this.item.relationsTo.on('remove',this.render,this);
    },
    onRender: function() {
      
      var tagButtonEl = jQuery("div#tagButton",this.el);

      
      if( this.isTagged() ){
        tagButtonEl.html("untag");
        tagButtonEl.addClass("red");
        tagButtonEl.removeClass("green");
      }
      else{
        tagButtonEl.html("tag");
        tagButtonEl.addClass('green');
        tagButtonEl.removeClass("red");
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
      this.tagSelected = tagType;
      this.updateVisibility();
    },
    onFilterSet : function( filter ){
      this.filter = filter;
      this.updateVisibility();
    },
    updateVisibility : function(){
      var visible = true;

      if( this.tagSelected ){
        if( this.model.get('type') !== this.tagSelected.get('name') ){
          visible = false;
        }
      }

      if( this.filter ){
        if( this.model.get('name').search(new RegExp(this.filter, "i") ) === -1 ){
          visible = false;
        }
      }
      if( visible ){
        jQuery( this.el ).show();
      }
      else{
        jQuery( this.el ).hide();
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
