/**
 * @author Marcin Nowak
 */
 

App.Views.Relations.Show = Backbone.View.extend({
	events: {
		"click .unTag"	: 	"unTag", 
	},
    initialize: function() {
	    this.model.bind('change', this.render);
    },
    
    render: function() {
        this.el.innerHTML = JST.relations_show({relative: this.model });
			
	return this;
    },
	unTag : function() {
	 	jQuery.getJSON(this.model.get('item_url')+'/tag/untag?tagging_id='+this.model.get('tagging_id'), function(data) {
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
