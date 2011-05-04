/**
 * @author Marcin Nowak
 */
var Alternative = Backbone.Model.extend({
    url : function() {
      var base = '/alternatives';
      

      if( this.collection ) {
	    if (this.isNew())  {
			return this.collection.item_url+base;
		}
		else {
      		return( this.collection.item_url+base+'/'+this.id);
		}
      }
      else {
	    if (this.isNew()) {
			return base;
		}
		else {	
      		return(base + '/' + this.id);
		}
      }
    },
/********** status and metrics stuff comes here ******************/
	decisionsTotal : function() {
		var totalCount = 0;
		_(this.attributes.decisions).each( function( decisionType ) {
			totalCount = totalCount + decisionType.count;
		});
		return totalCount;
	},
	decisionsSummary : function() {

		decisionsArray = new Object;
		
		_(this.attributes.decisions).each( function( decisionType ) {
			decisionsArray[decisionType.name] = decisionType.count;
		});
		return decisionsArray;

	},
	isDecided : function() {
		decisions = this.decisionsSummary();
		totalCount = this.decisionsTotal();
		
		
		// if there are no decisions then it is not decided
		if( totalCount == 0)
			return false;

		// this basically checks if given alternative has decisions spread over various decisions
		var colliding = false;
		
		// hack hack
		_(this.attributes.decisions).each( function( decisionType ) {
			if( decisionType.count != 0 && decisionType.count != totalCount )
				colliding = true;
		},this);
		
		if( colliding )
			return false;
		else
			return true;
	},
	
	isColliding : function() {
		if( this.decisionsTotal() > 0 && !this.isDecided() )
			return true;
		else
			return false;
	},
	
	decision : function() {

		// if given alternative is not decided upon, then give up
		if( !this.isDecided() )
			return null;
		
		var selectedDecision = "";
		
		_(this.attributes.decisions).each( function( decisionType ) {
			if( decisionType.count != 0 && decisionType.count == totalCount )
				selectedDecision = decisionType;
		},this);
		
		return selectedDecision;
	}
});


var Alternatives = Backbone.Collection.extend({
  model : Alternative,
  url : window.location.pathname+"/alternatives",
  comparator : function( model ) {
	return model.get('id');
  },
});
