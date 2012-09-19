/**
 * @author Marcin Nowak
 */
var Relative = Backbone.Model.extend({
    url : function() {
      var base = 'relations';
      if (this.isNew()) return base;
//      return '/items/' + this.id + '/tag/tags_list';
    }
});


var Relatives = Backbone.Collection.extend({
  model : Relative,
  url : "/relations", 
  parse: function( response ) {
		return( response.children );
  },
});