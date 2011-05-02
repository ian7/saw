/**
 * @author Marcin Nowak
 */

App.Views.Items.ProjectItem = Backbone.View.extend({
  events : {
  },

  alternativesCollection : null,

  initialize : function(options) {

	this.alternativesCollection = new Alternatives;
	
	this.alternativesCollection.issueView = this;
	// catch alternatives resource location hack
	this.alternativesCollection.item_url = this.model.url();
	this.alternativesCollection.url = this.model.url()+'/alternatives';

	this.alternativesCollection.bind('refresh',this.render);
	

    this.render = _.bind(this.render, this); 
    this.model.bind('change', this.render);

	this.isExpanded = false;

	
//	this.alternativesCollectionView = new App.Views.Alternatives.List({ collection: this.alternativesCollection, el: this.el });
	_(this).bindAll('notify');
		
	notifier.register( this );
  },

  render : function() {

	// fetch alterantives finally !
	this.alternativesCollection.fetch();

//	this.tempEL = document.createElement("tr");
//	this.tempEL.innerHTML = JST.items_index( {item: this.model} );

   this.el.innerHTML = JST.items_index( {item: this.model} );

//   this.alternativesCollectionView.render();

	
	// finally attach it ;)
//	this.el.innerHTML = this.tempEL.innerHTML;

   return this;
  },

  notify : function( broadcasted_id ) {
		if( this.model.get('id') == broadcasted_id ) {
			this.alternativesCollection.fetch();
			jQuery(this.el).effect("highlight", {}, 500);
		}
  }  

});

App.Views.Items.ProjectIndex = Backbone.View.extend({
  events : {
	"click .newItem" : "newItem",
	"click .expandAll" : "expandAll",
	"click .collapseAll" : "collapseAll",
//	"click .newItem" : 'checkNewItem',
  },

  newItemName : '(new item)',

  initialize : function() {

	_(this).bindAll('newItem','checkNewItem','removeNewItem','newItem');

	this.collection.bind('saved',this.checkNewItem );
	this.collection.bind('refresh',this.checkNewItem );
	
	this.collection.comparator = function( m ) { return m.get('id'); };

    // simply magic :)
    if( window.location.pathname.match('projects') ) {
		this.projectid = window.location.pathname.match('projects\/.*$')[0].substring(9,33);
	}

	this._itemsCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : App.Views.Items.ProjectItem,
      childViewTagName     : 'p',
	  childViewClassName   : 'itemList'
    });



	this.render();
	notifier.register(this);

  },
 
  render : function() {			
		this._rendered = true;
		this._itemsCollectionView.el = this.el; 
		this._itemsCollectionView.render();
		jQuery(this.el).prepend("<div class = 'button orange collapseAll'>Collapse all</div>");
		jQuery(this.el).prepend("<div class = 'button orange expandAll'>Expand all</div>");
//		jQuery(this.el).prepend("<div class = 'button red newItem'>New!</div>");
		this.checkNewItem();

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

/*		var preLastItem = collection.last();
		if( preLastItem.view ) {
			preLastItem.view.expand();
		}
*/
		
		i = new Item;

		// this.newItemName is unavailable when called by the 'save' event from the collection
		i.set({name: '(new item)' });
		collection.add( i );
		
  },
  notify : function( broadcasted_id ) {
/*		this.collection.each( function( i ) {	
			if( i.get('id') == broadcasted_id ) {
				i.fetch({
					success: function(model,resp) {
						model.change();
						jQuery(model.view.el).effect("highlight", {}, 500);
					}
				});
			}
		});
*/
		var thisView = this;
		
		if( this.projectid == broadcasted_id ) {
			this.collection.fetch({
				success: function(model, resp){
//					thisView.colllection
//					thisView.render();
				}
			});
		}
		
  },
  expandAll : function() {
	_.each(this._itemsCollectionView._childViews, function( childView ) {
		childView.expand();
	});
  },
  collapseAll : function() {
	_.each(this._itemsCollectionView._childViews, function( childView ) {
		childView.collapse();
	});
  },
  shortcut : function() {
	// alert("!");
  },
  checkNewItem : function() {
		this.removeNewItem();
		this.newItem();
  },
});


