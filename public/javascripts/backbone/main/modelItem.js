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
  model : App.Models.Item,
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

