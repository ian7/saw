/* this model is to be coupled with juggernaut notification mechanism  */

/*global App, Backbone */

App.Data.Model = Backbone.Model.extend({

});


App.Data.Item = App.Data.Model.extend({
    url : function() {
        if( this.id ) {
            return '/r/' + this.id;
        }
        else {
            return '/r';
        }
    }
});


App.Data.Items = App.Data.Collection.extend({
  url: '/items',
  model : App.Data.Item
});