

AlternativeView  = Backbone.View.extend({
    initialize: function() {
    },
    
    render: function() {

	   this.el.innerHTML = JST.alternatives_show( {a: this.model} );
	   return this;
    },
    // this updates single row in the table
    update: function( item_id ){
    		
    }
});


var AlternativeUpdatingView = AlternativeView.extend({
  initialize : function(options) {
    this.render = _.bind(this.render, this); 
    this.model.bind('change', this.render);
  }
});


App.Views.Alternatives.List = Backbone.View.extend({
  events : {
//	"click .newItem" : "newItem"
  },
  initialize : function() {
	this.alternativesCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : AlternativeUpdatingView,
      childViewTagName     : 'tr'
    });
	this.render();
  },
 
  render : function() {
		this.rendered = true;
		this.alternativesCollectionView.el = jQuery('table.alternativeList', this.el);
		this.alternativesCollectionView.render();
  },
/*,
  newItem : function() {
		i = new Item;
		i.set({name: '(unnamed)'});
		this.collection.add( i );
  },*/
});



