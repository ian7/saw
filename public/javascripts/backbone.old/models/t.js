/**
 * @author Marcin Nowak
 */



var T = Backbone.Model.extend({
/* I'm not sure yet what am I going to do with it 
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
	*/
});


var Ts = Backbone.Collection.extend({
  model : T,
//   url : "http://localhost:3000/r",
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
