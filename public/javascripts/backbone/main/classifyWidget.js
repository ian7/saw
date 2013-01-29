/*global App, Backbone,_,jQuery,JST*/

App.module("main", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.ClassifyWidget = Backbone.Marionette.CompositeView.extend({
    template: JST['main/classifyWidget'],
// itemViewContainer: 'div#itemList',
    className: 'ClassifyWidget',
    events: {
//      'click div#clearSelection': 'onClearSelection',
//      'click div#relationButtons button.btn' : 'onRelationClicked'
        'drop span.itemClassifier' : 'onDrop',
        'dragover span.itemClassifier' : "onDragOver"
    },
    shortcuts: {},
    speedButtons: {
    },
    templateHelpers: {},
    initialize: function( options ) {
      _(this).bindAll();

      this.tagType = options.tagType;
      this.itemView = App.main.Views.ClassifyWidgetItem;
      this.itemViewOptions = {
        context: this.context,
        tagType: this.tagType
      };
    
      this.tagInstances = _(App.main.context.tags.models).filter( function( tagInstance ) {
        return( tagInstance.get('type') === this.tagType.get('name') );
      },this);
          
      this.on('composite:model:rendered',this.onModelRendered,this);
      this.collection.on('add',this.render,this);
      this.collection.on('remove',this.render,this);
      this.collection.on('relationsChanged',this.render,this);
    },
    onModelRendered : function(){
      var typesEl = jQuery("span#classified",this.el);
    
      var h = "";
      _(this.tagInstances).each( function( tagInstance ){
        h += "<span id='"+ tagInstance.get('id') +"' class='itemClassifier'>";
        h += tagInstance.get('name') + ":<ul id='"+ tagInstance.get('id') +"' class='itemClassifier'></ul>";
        h += "</span>";
      },this);
      
      typesEl.html(h);
      this.delegateEvents();
    },
    appendHtml : function( containerView, itemView ){

      var tagInstance = _(this.tagInstances).find( function( tag ){
        return _(itemView.model.relationsTo.models).find( function(relation){ 
          return( relation.get('origin') === tag.get('id') );
        },this);
      },this);


      var subEl = null;

      if( tagInstance ){
          subEl = jQuery( "ul#"+tagInstance.get('id'), containerView.el );
      }
      else{
          subEl = jQuery("ul#unclassified",containerView.el);
      }
      
      subEl.append( itemView.el );
    },
    onRender : function(){
       this.delegateEvents();
    },
    onDrop : function( event ){
        var draggedItemID = event.originalEvent.dataTransfer.getData('id');
        var draggedModel = _(this.collection.models).find( function( model ){
            return( model.get('id') === draggedItemID );
        },this);
        var destinationTagID = jQuery(event.target).parents('*').andSelf().filter("span.itemClassifier").attr('id');
        var destinationTag = _(this.tagInstances).find( function( tag ) {
            return( tag.get('id') === destinationTagID );
        },this);

        // let's remove existing taggings
        _(draggedModel.relationsTo.models).each( function( relation ){
          _(this.tagInstances).each( function( tag ){
              if( relation.get('origin') === tag.get('id') ){
                relation.destroy();
              }
          },this);
        },this);

        // let's make a new one
        draggedModel.tag( destinationTag );
    },
    onDragOver : function( event ){
      event.preventDefault();
    },
    onCollectionNotify : function( notification ){
      if( notification.distance === 1 && (
            notification.event === 'dotag' || 
            notification.event === 'destroy')){
        this.render();
      }
    }
  });
});