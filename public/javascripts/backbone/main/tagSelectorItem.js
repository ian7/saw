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
      this.context.on("capture:item:gotTagReferences", this.updateItems,this);
      this.itemReferences = [];

      this.options = {};
      this.options.hideEmpty = true;

      this.context.on("typeSelector:selectedTag",this.setHighlight,this);
    },
    onRender: function() {
      if( this.options.hideEmpty ){
        jQuery( this.el ).hide();
      }
    },
    onClick: function() {
      this.context.dispatch("typeSelector:selectedTag", this.model);
    },
    setHighlight : function( tagModel ){
      if( tagModel && tagModel.get('_id') === this.model.get('_id')){
        jQuery(this.el).first().addClass('red');
      }
      else{
        jQuery(this.el).first().removeClass('red');
      }
      return false;
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

        if( this.itemReferenceCount > 0 && this.options.hideEmpty ){
          jQuery( this.el ).show();
        }

        jQuery("span#itemCount",this.el).first().html(this.itemReferenceCount);
        }
      }
  });
});