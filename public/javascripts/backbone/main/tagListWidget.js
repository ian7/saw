/*global App, Backbone,_,jQuery,JST*/

App.module("main", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.TagListWidget = Backbone.Marionette.CompositeView.extend({
    template: JST['main/tagListWidget'],
    itemViewContainer: 'div#tagTypesList',
    tagName: "div",
    className: "tagListWidget",
    events: {
      'click li' : 'onClick',
      "click div#clearFilter" : 'onClearFilter'
    },
    shortcuts: {},
    speedButtons: {},
    initialize: function(options) {
      _(this).bindAll();


      this.itemView = App.main.Views.TagListWidgetItem;
      this.hideEmpty = options.hideEmpty;

      // that's what we got at init
      this.itemCollection = this.collection;

      this.collection = new App.Data.SuperCollection();

      _(this.itemCollection.models).each( function( item ){
        this.collection.addCollection( item.getRelationsTo() );
      },this);

      this.itemCollection.on('add',function( item ){
        this.collection.addCollection( item.getRelationsTo() );
      },this);

      this.itemCollection.on('remove',function( item ){
        this.collection.removeCollection( item.getRelationsTo() );
      },this);

      this.itemViewOptions = {
        context: this.context,
        hideEmpty: this.hideEmpty
      };
 
     },
    onRender: function() {
      var h="";
      var tagCollection = new Backbone.CollectionFilter( { collection: App.main.context.types, filter: { super_type: "Tag" }  });

      tagCollection.each( function( tag ){
        h += "<div id='"+ tag.get('name') +"' class='tagType'>" + tag.get('name') 
          + "<ul id='"+ tag.get('name') +"'></ul>"
          + "</div>";

      },this );
      jQuery("div#tagTypesList",this.el).append( h );
      jQuery("div.tagType",this.el).hide(); 
      _(this.children).each( function( child ) { child.render() })     
      
    },
    onClick : function(event){
      // opens tagging widget
      //var widget = new App.main.Views.TaggingWidget({context:this.context, model: this.model });
      //App.main.layout.modal.show( widget );
      var element = jQuery( event.target );
      if( element.hasClass('tagId') ) {
          App.main.context.dispatchGlobally('tagListWidget:tagSelected',event.target.id);
          jQuery(".tagId").removeClass('red');
          element.addClass('red');
      }
    },
    onClearFilter : function(){
        jQuery(".tagId").removeClass('red');
        App.main.context.dispatchGlobally('tagListWidget:tagSelected',null);
    }
  });
});