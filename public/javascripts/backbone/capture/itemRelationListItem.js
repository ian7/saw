/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.ItemRelationListItem = Backbone.Marionette.CompositeView.extend({
    template: JST['capture/itemRelationListItem'],
    className: '',
    tagName: 'tr',
    events: {
    },
    initialize: function( options ) {
      _(this).bindAll();
      this.relationEnd = options.relationEnd;

      this.itemModel = new App.Data.Item();
      this.itemModel.id = this.model.get(this.relationEnd);
      this.itemModel.fetch();

      this.subView = new App.main.Views.ItemAttributeWidget({
        context: this.context,
        model: this.itemModel,
        attribute: 'name'
      });  
    },
    onRender: function() {

      var relationNameEl = jQuery("span#relationName",this.el);
      var relationType = App.main.context.types.findByName( this.model.get('relation') );

      if( this.relationEnd === 'origin' ){
        if( relationType.get('reverse_name') ) {
          relationNameEl.html( relationType.get('reverse_name') + " by");
        }
        else{
          relationNameEl.html( "(reverse) " +relationType.get('name') + " by");          
        }
      }
      else{
        relationNameEl.html( relationType.get('name'));
      }

      this.subView.setElement( jQuery( "td#subItem",this.el ));
      this.subView.render();
    }
  });
});
