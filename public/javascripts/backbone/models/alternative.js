/**
 * @author Marcin Nowak
 */
var Alternative = Backbone.Model.extend({
    url : function() {
      var base = '/alternatives';
      if (this.isNew()) return base;
      return(base + '/' + this.id);
    }
});