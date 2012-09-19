/**
 * @author Marcin Nowak
 */
var Relation = Backbone.Model.extend({
    url : function() {
      var base = 'relations';
      if (this.isNew()) return base;
//      return '/items/' + this.id + '/tag/tags_list';
    }
});


var Relations = Backbone.Collection.extend({
  model : Relation,
  url : "/relations", 
  parse : function( data ){
	return data;
  },
});