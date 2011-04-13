/**
 * @author Marcin Nowak
 */
 
/*
TagAddView = Backbone.View.extend({
    initialize: function() {
	    this.render = _.bind(this.render, this); 
	    this.model.bind('change', this.render);
        this.render();
    },
    
    render: function() {
    	var out =""
        if(this.tags.length > 0) {
        	out = JST.tags_add({tags: this.tags });
        } else {
            out = "<h3>No Tags :(</h3>";
        }
        jQuery(this.el).html(out);
    }
});




App.Views.AddTag = Backbone.View.extend({
  events : {
//	"click .newItem" : "newItem",
//	"keypress"		 : "shortcut"
  },
  initialize : function() {
	this.tagCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : TagAddView,
      childViewTagName     : 'li'
    });
	this.render();
//	notifier.register(this);
//	this.collection.bind('saved',this.newItem)
  },
  render : function() {
		this._rendered = true;
		this.tagCollectionView.el = jQuery('li.tagList', this.el);
		this.tagCollectionView.render();
	//	this.newItem();
  },  
});
*/