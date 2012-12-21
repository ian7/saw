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

      // in case we're looking on the origins, then we might want to display 'reverse_name'
      // instead of simply displaying 'name'
      if( this.relationEnd === 'origin' ){
        if( relationType.get('reverse_name') ) {
          relationNameEl.html( relationType.get('reverse_name') + " by");
        }
        else{
          relationNameEl.html( "(reverse) " +relationType.get('name') + " by");          
        }
      }
      // similarly to what happens above, if we're about the tips, and there is 'forward_name'
      // available, then let's use it. 
      // 
      if( this.relationEnd === 'tip'){
        if( relationType.get('forward_name') ) {
          relationNameEl.html( relationType.get('forward_name'));
        }
        else{
          relationNameEl.html( '(forward) '+relationType.get('name'));
        }
      }

      this.subView.setElement( jQuery( "td#subItem",this.el ));
      this.subView.render();
    }
  });
});
