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
		
	},
	decisionsSummary : function() {
		
	},
});


var Alternatives = Backbone.Collection.extend({
  model : Alternative,
  url : window.location.pathname+"/alternatives",
  
});
