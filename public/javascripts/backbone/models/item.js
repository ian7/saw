/**
 * @author Marcin Nowak
 */



var Item = Backbone.Model.extend({
	state : {
		noAlternatives : 'No alternatives',
		noDecisions : 'No decisions were made yet',
		missingDecisions : 'Some decisions are missing',
		notConclusive : 'Decisions are not conclusive (multiple positive)',
		openNonConclusive : 'Decisions not conclusive (open alternatives)',
		noSolution : 'There are no Acceptable alternatives',
		decided : 'Decided',
		unknown : 'That shouldn\'t happen',
	},
    url : function() {
		var base = "";
		// in case there is a collection attached to this item
		// we do some (evil) url arthmetics 
		if( this.collection ) {
			base = this.collection.url();
		}
		else {
		  // otherwise we do even more evil location arthmetics
	      base = window.location.pathname;
		}
		if (this.isNew()) 
			return base;

	    return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id; 
	},
	
	alternatives : null,
	/************* metrics come here ********************/
	/* they assume that there is an .alternatives field here */
	decisionState : function() {
		
		if( !this.alternatives )
			return this.state.unknown;
		
		if( this.alternatives.length == 0)
			return this.state.noAlternatives;
		
		var decisionsTotal = 0;	
		var foundNotDecidedAlterantive = false;
		var positiveAlternatives = 0;
		var openAlternatives = 0;
		
		_(this.alternatives.models).each( function( alternative ) {
			decisionsTotal = decisionsTotal + alternative.decisionsTotal();

			if( alternative.decisionsTotal() == 0 )
				foundNotDecidedAlterantive = true;
			
			decision = alternative.decision();
			
			if( decision ) {
				if( decision.name == 'Positive' ) {
					positiveAlternatives = positiveAlternatives + 1;
				}
				if( decision.name == 'Open' ) {
					openAlternatives = openAlternatives + 1;
				}
			}
			
			
		},this);
		
		if( decisionsTotal == 0 )
			return this.state.noDecisions;
			
		if( foundNotDecidedAlterantive )
			return this.state.missingDecisions;
			
		if( positiveAlternatives > 1 )
			return this.state.notConclusive;

		if( positiveAlternatives == 0  )
			return this.state.noSolution;
		
		if( positiveAlternatives == 1 ) {
			if( openAlternatives > 0 )
				return this.state.openNonConclusive;
			else
				return this.state.decided;
		}
			
		// that shouldn't happen
		return this.state.unknown;
	},
	
	
	
});


var Items = Backbone.Collection.extend({
  model : Item,
  url : function() {
	if( !this.urlOverride ) {
		return window.location.pathname;
	}
	else {
		return this.urlOverride;
	}
	},
  urlOverride : null
});

