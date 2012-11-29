/*global App, Backbone,_,jQuery,JST*/

App.module("main", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.TagSelectorItem = Backbone.Marionette.CompositeView.extend({
    template: JST['main/tagSelectorItem'],
    itemReferenceCount: 0,
//    itemReferences: [],
    events: {
      'click span#tag': 'onClick'
    },
    initialize: function() {
      _(this).bindAll();
      this.context.on("capture:item:gotTagReferences", this.updateItems,this);
      this.itemReferences = [];
    },
    onRender: function() {

    },
    onClick: function() {
      this.context.dispatch("typeSelector:selectedTag", this.model);
    },
    updateItems: function(model) {
      // get count of the given tag in the issue
      var count = model.relationsTo.where({
          relation: 'Tagging',
          origin: this.model.get('_id')
        }).length;

      if( count > 0 ){
          this.itemReferences.push(model.get('id')) ;
             // zero the co  
        }
      this.itemReferenceCount = this.itemReferences.length;

    /*
      // go over all the issues accumulated so far
      _(this.itemReferences).each(function(value, key) {
        this.itemReferenceCount = this.itemReferenceCount + value;
      }, this);
*/
      // set it up!
      jQuery("span#itemCount",this.el).first().html(this.itemReferenceCount);
      }
  });
});