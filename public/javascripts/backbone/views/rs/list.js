/**
 * @author Marcin Nowak
 */
 

App.Views.Rs.Show = Backbone.View.extend({
	events: {
	},
    initialize: function() {
      _(this).bindAll('render');
	    this.model.bind('change', this.render);
    },
    
    render: function() {
//        this.el.innerHTML = JST.relations_show({relative: this.model });
        this.el.innerHTML = "Name: " + this.model.attributes.name;			
	      return this;
    },
});


App.Views.Rs.List = Backbone.View.extend({
  events : {
  },
  initialize : function() {


  _(this).bindAll('newItem','checkNewItem','removeNewItem','newItem');

  this.collection.bind('saved',this.checkNewItem );
  this.collection.bind('refresh',this.checkNewItem );


	this.relationsCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : App.Views.Rs.Show,
      childViewTagName     : 'div',
      childViewClassName   : 'r'
    });



	_(this).bindAll('render');
//	this.firstRender = true;
    this.render();
    this.checkNewItem();
  },
  render : function() {
		this._rendered = true;
    this.relationsCollectionView.el = this.el;
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
