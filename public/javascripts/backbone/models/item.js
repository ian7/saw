/**
 * @author Marcin Nowak
 */



var Item = Backbone.Model.extend({
    url : function() {
      var base = '/items';
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
    }
});


var Items = Backbone.Collection.extend({
  model : Item,
  url : "/items"
});

