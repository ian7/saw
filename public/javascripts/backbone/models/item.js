/**
 * @author Marcin Nowak
 */



var Item = Backbone.Model.extend({
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
	}
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

