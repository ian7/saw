/*global Backbone,App*/

App.Models.Item = Backbone.Model.extend({
    url : function() {
        if( this.id ) {
            return '/r/' + this.id;
        }
        else {
            return '/r';
        }
    }
});


App.Models.Items = Backbone.Collection.extend({
  url: '/items',
  model : App.Models.Item
});

