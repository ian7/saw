/**
 * @author Marcin Nowak
 */
var Alternative = Backbone.Model.extend({
    url : function() {
      var base = '/alternatives';
      if (this.isNew()) return base;
      
      if( this.item_id ) {
      	return( '/items/'+this.item_id+base+'/'+this.id)
      }
      else {
      	return(base + '/' + this.id);
      }
    }
});


var Alternatives = Backbone.Collection.extend({
  model : Alternative,
  url : "/alternatives"
});
