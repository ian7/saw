/**
 * @author Marcin Nowak
 */
 

TagView = Backbone.View.extend({
	events: {
		"click .unTag"	: 	"unTag", 
	},
    initialize: function() {
//	    this.render = _.bind(this.render, this); 
	    this.model.bind('change', this.render);
    },
    
    render: function() {
        this.el.innerHTML = JST.tags_list({tag: this.model });
			
//        jQuery(this.el).html(out);
	return this;
    },
	unTag : function() {
	 	jQuery.getJSON(this.model.get('item_url')+'/tag/untag?tagging_id='+this.model.get('tagging_id'), function(data) {
	    	// so let's update it !'
   	    	//App.controller.update();
    		});
//		alert(this.model.get('id'));
	}
});


App.Views.Tags.List = Backbone.View.extend({
  events : {
//	"click .newItem" : "newItem",
//	"keypress"		 : "shortcut"
  },
  initialize : function() {
	this.tagCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : TagView,
      childViewTagName     : 'tr'
    });
//	this.render();
//	notifier.register(this);
//	this.collection.bind('saved',this.newItem)
  },
  render : function() {
		this._rendered = true;
		this.tagCollectionView.el = jQuery("table.tagsList",this.el);
		this.tagCollectionView.render();
	//	this.newItem();
  },  
});
