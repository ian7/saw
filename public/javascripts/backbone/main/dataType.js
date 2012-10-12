/*global App,Backbone */

App.Data.Type = Backbone.Model.extend({
});

App.Models.Types = Backbone.Collection.extend({
  model : App.Models.Type,
  url : function() {
    if( !this.urlOverride ) {
        return "/t";
    }
    else {
        return this.urlOverride;
    }
  },
  urlOverride : null
});

