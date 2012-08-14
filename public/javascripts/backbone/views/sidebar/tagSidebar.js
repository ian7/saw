

App.Views.TaggingView = Backbone.Marionette.ItemView.extend({
  template: '#TaggingViewTemplate',
  tagName: 'tr',
  className: 'TaggingViewTemplate',
  templateHelpers: {
    get : function( id ){
        if( this[id] ){
            return(this[id]);
        }
        else{
            return("(empty)");
        }
    },
  },

  initialize : function(){
		_(this).bindAll();
	},

});

App.Views.TagSidebar = Backbone.Marionette.CompositeView.extend({
  template: '#TagSidebarTemplate',
  itemView: App.Views.TaggingView,
  className: 'TagSidebarTemplate',
  events : {
  },
  initialize : function() {
   	_(this).bindAll();

   	this.collection = new Backbone.Collection();
    this.collection.on('add',this.updateTagCount,this);
    this.collection.on('remove',this.updateTagCount,this);
    this.collection.on('reset',this.updateTagCount,this);
    this.collection.on('sync',this.updateTagCount,this);
    eventer.register(this);
  },
  appendHtml : function( collectionView, itemView, index ){
    jQuery("table.TagList tbody",collectionView.el).prepend(itemView.el);
  },
  updateTagCount : function(){
    var count = this.collection.length.toString();
    var element = jQuery("table.tagList tr.foot td",this.el);
    if( count == 1 ){
      element.html( count + " tag")
    }
    else{
      element.html( count + " tags");
    }
  },
  onRender : function(){
    console.log("TagSidebar: onRender");
  },
  notifyEvent : function( data ) {
    e = JSON.parse(data)
  },
  display : function( item_model ){
    this.model = item_model;
    if( !this.model.id ){
      console.log("TagSidebar: crashed because model.id == 0");
      return;
    }
//    this.collection = new Backbone.Collection();
    this.collection.url = "/items/"+this.model.id + "/tag/tags_list";
    this.collection.fetch();
  }
});