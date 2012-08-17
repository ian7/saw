

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
});

App.Views.TagSidebar = Backbone.Marionette.CompositeView.extend({
  template: '#TagSidebarTemplate',
  itemView: App.Views.TaggingView,
  className: 'TagSidebarTemplate',
  events : {
    "click div#newTaggingButton" : 'newTagging',
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
    if( this.model && e.id == this.model.get('id') ){
      this.collection.fetch();
    }
  },
  display : function( item_model ){

    this.model = item_model;

    if( item_model ) {
      if( !this.model.id ){
        console.log("TagSidebar: crashed because model.id == 0");
        return;
      }
      this.collection.url = "/items/"+this.model.id + "/tag/tags_list";
      this.collection.fetch();
    }
    else{
      this.collection.reset();
    }

  },
  newTagging : function(){
    tw = new App.Views.TaggingWidget({ model: this.model });
    layout.modal.show( tw );
  }
});


App.Views.TagSelectorItem = Backbone.Marionette.ItemView.extend({
  template: '#TagSelectorTemplate',
  tagName: 'tr',
  className: 'tag',
  templateHelpers: {
    get : function( id ){
        if( this[id] ){
            return(this[id]);
        }
        else{
            return("(empty)");
        }
    },
    tagUntag : function(){
      }
  },
  events: {
    "click div.addTagging": 'addTagging',
    "click div.removeTagging": 'removeTagging',
  },
  initialize : function(){
    _(this).bindAll();
    this.model.collection.existingTags.on('add',this.existingTagsChanged,this);
    this.model.collection.existingTags.on('remove',this.existingTagsChanged,this);
  },
  existingTagsChanged : function(){
    this.onRender();
  },
  addTagging : function( e ){
        jQuery.getJSON('/items/'+this.model.collection.item.id.toString()+'/tag/dotag?from_taggable_id='+this.model.get('id'),function(){});
        this.refreshCollections();
  },
  removeTagging : function( e ){
        jQuery.getJSON('/items/'+this.model.collection.item.id.toString()+'/tag/untag?from_taggable_id='+this.model.get('id'),function(){});
        this.refreshCollections();
  },
  refreshCollections : function(){
        this.model.collection.fetch();
        this.model.collection.existingTags.fetch();
  },
  onRender : function(){
    this.el.id = this.model.id;
    var h = ""
    var found = false;
      this.model.collection.existingTags.each(function( existingTag ){
        // if this thing is on the tagging list
        if( existingTag.id == this.model.id ) {
          found = true;
        }
      },this);

      if( found ){
        h = "<div class='removeTagging'>[remove tagging]</div>";
      }
      else{
        // otherwise if it wasn't on the list of the existing tags
        h = "<div class='addTagging'>[add tagging]</div>";
      }
      jQuery("td.action",this.el).html(h);
  }
});

 
App.Views.TaggingWidget = Backbone.Marionette.CompositeView.extend({
  template: '#TaggingWidgetTemplate',
  itemView: App.Views.TagSelectorItem,
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
  events: {
    "keyup input.searchBox": 'doFilter'
  },
  initialize : function(){
    _(this).bindAll();
    this.collection = new Backbone.Collection();
    this.collection.url = "/issues/"+this.model.id+'/tag/list.json';
    this.collection.fetch();

    // i'll need it for tagging
    this.collection.item = this.model;

    this.existingTags = new Backbone.Collection();
    this.existingTags.url = "/items/"+this.model.id + "/tag/tags_list";
    this.existingTags.fetch();

    this.collection.existingTags = this.existingTags;
  },
  onRender : function(){
    //debugger
  },
  appendHtml :  function( collectionView, itemView, index ){
    jQuery("table.TagSelector tbody",collectionView.el).prepend(itemView.el);
  },
  doFilter : function( e ){

    filter = e.srcElement.value.toLowerCase();

    if( filter != "" ) {
      _(this.children).each( function( v, id ) {
        if( v.model.attributes.name.toLowerCase().match(filter) ||
            v.model.attributes.type.toLowerCase().match(filter)){
          jQuery(v.el).removeClass('hidden');
        }
        else{
          jQuery(v.el).addClass("hidden");
        }
      }, this);
    }
    else {
      _(this.children).each( function( v, id ) {
          jQuery(v.el).removeClass('hidden');
      }, this);      
    }
  },
 });