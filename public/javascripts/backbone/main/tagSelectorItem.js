/*global App, Backbone,_,jQuery,JST*/

App.module("main", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.TagSelectorItem = Backbone.Marionette.CompositeView.extend({
    template: JST['main/tagSelectorItem'],
    itemReferenceCount: 0,
//    itemReferences: [],
    events: {
      'click span#tag': 'onClick'
    },
    initialize: function( options ) {
      _(this).bindAll();

      
      if( !options.taggedItemsCollection ){
          debugger;
      }
      
      // let's pass collection of items that are actually tagged:
      this.taggedItemsCollection = options.taggedItemsCollection;
      this.taggedItemsCollection.on('add',this.onTaggedItemsCollectionChanged,this);
      this.taggedItemsCollection.on('remove',this.onTaggedItemsCollectionChanged,this);

      this.itemReferences = [];

      /*this.options = {};
      this.options.hideEmpty = true;
      */
     this.hideEmpty = options.hideEmpty;

      this.context.on("typeSelector:selectedTag",this.setHighlight,this);
  
      this.context.on('type:selected', this.setHighlightType,this.model);
    },
    onRender: function() {
      if( this.hideEmpty ){
        jQuery( this.el ).hide();
      }
      this.onTaggedItemsCollectionChanged();
    },
    onClick: function() {
      this.context.dispatch("typeSelector:selectedTag", this.model);
    },
    setHighlight : function( tagModel ){
      if( tagModel && tagModel.get('id') === this.model.get('id')){
        jQuery(this.el).first().addClass('red');
      }
      else{
        jQuery(this.el).first().removeClass('red');
      }
      return false;
    },
    // this is not exactly what one would call optimall....
    onTaggedItemsCollectionChanged : function(){
      var count = 0;
      _(this.model.relationsFrom.models).each( function( relation ) {
        if( relation.get('relation') === 'Tagging') {
          var subCount = this.taggedItemsCollection.where({
            id: relation.get('tip')
          }).length;
          count += subCount;
        }
      },this);
      if( count > 0 ){
        jQuery( this.el ).show();
      }
      this.itemReferenceCount = count;
      jQuery("span#itemCount",this.el).first().html(this.itemReferenceCount);
    },
    updateItems: function(model) {
      // get count of the given tag in the issue
      var count = model.relationsTo.where({
          relation: 'Tagging',
          origin: this.model.get('_id')
        }).length;

      if( count > 0 ){
          this.itemReferences.push(model.get('id')) ;
        this.itemReferenceCount = this.itemReferences.length;

        if( this.itemReferenceCount > 0 && this.hideEmpty ){
          jQuery( this.el ).show();
        }

        }
      }
  });
});