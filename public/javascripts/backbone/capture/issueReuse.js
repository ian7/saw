/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.IssueReuse = Backbone.Marionette.CompositeView.extend({
    template: JST['capture/issueReuse'],
    itemViewContainer: 'div#itemList',
    events: {
      'click div#clearSelection' : 'onClearSelection'
    },
    shortcuts: {},
    speedButtons: {},
    initialize: function() {
      _(this).bindAll();

      this.itemView = App.main.capture.Views.IssueReuseItem;
      this.itemViewOptions = {
        context: this.context
      };

      var types = new Backbone.CollectionFilter({
        collection: this.context.parentContext.types,
        filter: {
          super_type: "Tag"
        }
      });

      this.typeSelector = new App.main.Views.TypeSelector({
        context: this.context,
        collection: types,
        options: {
          hideEmpty: true
        }
      });
      //      this.collection = this.context.allIssues;
      /*    this.context.on('itemSelector:selectedItem',this.onItemSelected,this);
      this.context.on('typeSelector:selectedTag',this.onTagSelected,this);
     */
    },
    onRender: function() {
      this.typeSelector.setElement(jQuery("div#typeSelector", this.el));
      this.typeSelector.render();
    },
    onItemSelected: function(item) {
      jQuery("span#itemName", this.el).html(item.get('name'));
    },
    onTagSelected: function(item) {
      jQuery("span#tagName", this.el).html(item.get('name'));
    },
    onClearSelection : function(){
      this.context.dispatch('typeSelector:selectedTag',null);
    }
  });
});