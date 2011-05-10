/**
 * @author Marcin Nowak
 */
 

App.Views.Relations.Show = Backbone.View.extend({
	events: {
		"click .unRelate"	: 	"unRelate", 
	},
    initialize: function() {
	    this.model.bind('change', this.render);
    },
    
    render: function() {
        this.el.innerHTML = JST.relations_show({relative: this.model });
			
	return this;
    },
	unRelate : function( e ) {
		
		jQuery(".unRelate",this.el).fastConfirm({
           position: "left",
              questionText: "Are you sure ?",
              onProceed: function(trigger) {
			 		jQuery.getJSON('/relations/unrelate?relation_id=' + e.srcElement.id, function(data) {});
                       $(trigger).fastConfirm('close');
               },
               onCancel: function(trigger) {
                       $(trigger).fastConfirm('close');
               }
            });
	} 
});


App.Views.Relations.List = Backbone.View.extend({
  events : {
//	"click .newRelative" : "newRelative",
//	"click .searchBox" : "selectAll",
  },
  initialize : function() {

	this.relationsCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : App.Views.Relations.Show,
      childViewTagName     : 'li'
    });

	_(this).bindAll('render');
	this.firstRender = true;
  },
  render : function() {
		this._rendered = true;
		this.relationsCollectionView.el = jQuery("ul.relations",this.el);
		this.relationsCollectionView.render();

   },  
});
