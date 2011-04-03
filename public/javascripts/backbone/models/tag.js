/**
 * @author Marcin Nowak
 */
var Tag = Backbone.Model.extend({
    url : function() {
      var base = 'tags';
      if (this.isNew()) return base;
      return '/items/' + this.id + '/tag/tags_list';
    }
});