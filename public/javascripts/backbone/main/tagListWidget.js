/*global App, Backbone,_,jQuery,JST*/

App.module("main", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.TagListWidget = Backbone.Marionette.CompositeView.extend({
    template: JST['main/tagListWidget'],
    itemViewContainer: 'div#tagTypesList',
    tagName: "div",
    className: "tagListWidget",
    events: {
      'click' : 'onClick'
    },
    shortcuts: {},
    speedButtons: {},
    initialize: function(options) {
      _(this).bindAll();


      this.itemView = App.main.Views.TagListWidgetItem;
      this.hideEmpty = options.hideEmpty;

      this.itemViewOptions = {
        context: this.context,
        hideEmpty: this.hideEmpty
      };

      this.context.on( "item:selected" ,this.onItemSelected, this );
      
      this.model.updateRelationsTo = true;
    },
    onRender: function() {
      var h="";
      var tagCollection = new Backbone.CollectionFilter( { collection: this.context.types, filter: { super_type: "Tag" }  });

      tagCollection.each( function( tag ){
        h += "<div id='"+ tag.get('name') +"' class='tagType'>" + tag.get('name') 
          + "<ul id='"+ tag.get('name') +"'></ul>"
          + "</div>";

      },this );
      jQuery("div#tagTypesList",this.el).append( h );
      jQuery("div.tagType",this.el).hide();      
      
    },
    onClick : function(){
      // opens tagging widget
      var widget = new App.main.Views.TaggingWidget({context:this.context, model: this.model });
      App.main.layout.modal.show( widget );
    }
  });
});