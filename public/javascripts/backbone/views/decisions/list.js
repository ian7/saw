

DecisionsUpdatingView  = Backbone.View.extend({
	className : "decision", 
    events : {
    },
    initialize: function() {

		_(this).bindAll('render');
	    this.model.bind('change', this.render);
//		notifier.register(this);
    },
    
    render: function() {

	
	   this.el.innerHTML = JST.decision_show( {a: this.model} );
	   
	
	 /*
	   color = "white";

	   if( this.model.attributes.decisions ) {
		   _.each( this.model.attributes.decisions, function( decision ) {
			    if( decision.count > 0 ) {
					if( color == 'white' ) {
						color = decision.color;
					}
					else {
						color = 'gray';
					}
				}
			});
		}
	   // hell love chainging !
	   jQuery(this.el).removeClass().addClass("decision").addClass(color.toLowerCase());
	  */
	
	   return this;
    },

});



App.Views.Decisions.List = Backbone.View.extend({
  events : {
//	"click .newItem" : "newItem"
  },
  initialize : function() {
	this.alternativesCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : DecisionsUpdatingView,
      childViewTagName     : 'tr'
    });
	this.render();
//	notifier.register(this);

	this.collection.bind('refresh', this.checkNewAlternative);
  },
 
  render : function() {
		this.rendered = true;
		this.alternativesCollectionView.el = jQuery('table.decisionList', this.el);
		this.alternativesCollectionView.render();
  },
  notify : function( broadcasted_id ) {
		this.collection.each( function( i ) {	
/*			if( i.get('id') == broadcasted_id ) {
				i.fetch();
				i.change();
			}
			*/
		});
  },
});



