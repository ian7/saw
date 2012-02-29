
App.Views.Ts.RoutingElement = Backbone.View.extend({
  events: {
  },
    initialize: function() {
      _(this).bindAll('render');
      this.model.bind('change', this.render);
    },
    
    render: function() {
        this.el.innerHTML = "<a href=\"#"+this.model.attributes.name+"\">"+this.model.attributes.name+"</a> " +
                "<b>["+this.model.attributes.count+"]</b>"
        return this;
    },
});


App.Views.Ts.RoutingList = Backbone.View.extend({
  events : {
//    "keyup input.searchBox" : "searchBoxEdited",
  },
  initialize : function() {

//  _(this).bindAll('newItem','checkNewItem','removeNewItem','newItem');

  this.collection.bind('saved',this.checkNewItem );
  this.collection.bind('refresh',this.checkNewItem );

  this.relationsCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : App.Views.Ts.RoutingElement,
      childViewTagName     : 'td',
      childViewClassName   : 'name'
    });
    _(this).bindAll('render');

  },
  render : function() {

    h = "<table width=\"100%\" class=\"typeMenu\"><tr></tr></table>";

    this.el.innerHTML = h;  
    this._rendered = true;

    this.relationsCollectionView.el = jQuery("tr",this.el);
    this.relationsCollectionView.render();
   },  
 
  removeNewItem : function() {
    this.collection.each( function( i ) {
      if( i.get('name') == '(new item)' ) {
        this.collection.remove( i );
        delete i;
      } 
    },this);
  },
  
  newItem : function() {
    var collection;

    if( this.collection ) {
      // we're called from the render method
      collection = this.collection; 
    }
    else {
      // we're called because collection element has been saved 
      collection = this;      
    }
    i = new Item;

    // this.newItemName is unavailable when called by the 'save' event from the collection
    i.set({name: '(new item)' });
    collection.add( i );    
  },

  checkNewItem : function() {
    this.removeNewItem();
    this.newItem();
  },


  });
  