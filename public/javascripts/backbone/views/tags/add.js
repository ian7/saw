/**
 * @author Marcin Nowak
 */
 

TagAddView = Backbone.View.extend({
	events : {
		"click .doTag": "doTag", 
	},
    initialize: function() {
	    this.render = _.bind(this.render, this); 
	    this.model.bind('change', this.render);
        this.render();
    },
    
    render: function() {
       	out = JST.tags_add({tag: this.model });
        jQuery(this.el).html(out);

		return this;
    },
	doTag: function() {
		jQuery.getJSON(this.model.get('item_url')+'/tag/dotag?from_taggable_id='+this.model.get('id'), function(data) {
	   		});
	}
});


App.Views.Tags.AddTag = Backbone.View.extend({
  events : {
//	"click .newItem" : "newItem",
//	"keypress"		 : "shortcut"
  },
  initialize : function() {
	this.tagCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : TagAddView,
      childViewTagName     : 'tr'
    });
	this.render();
//	notifier.register(this);
//	this.collection.bind('saved',this.newItem)
  },
  render : function() {
		this._rendered = true;
		this.tagCollectionView.el = jQuery('table.tagList', this.el);
		this.tagCollectionView.render();
	//	this.newItem();
  },  
});
