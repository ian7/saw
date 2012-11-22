/*global App,Backbone,_ */

App.Data.Type = Backbone.Model.extend({});

App.Models.Types = Backbone.Collection.extend({
  initialize: function() {
    _(this).bindAll();
  },
  model: App.Data.Type,
  url: function() {
    if(!this.urlOverride) {
      return "/t";
    } else {
      return this.urlOverride;
    }
  },
  urlOverride: null,
  getByName: function(name) {
    var foundItems = this.where({
      name: name
    });
  }
});