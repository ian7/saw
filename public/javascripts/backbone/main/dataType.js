/*global App,Backbone,_ */

App.Data.Type = Backbone.Model.extend({
    isA: function(typeName) {
    if(typeName.toLowerCase() === this.get('name').toLowerCase()) {
      return true;
    } else {
      if(this.get('super_type') && this.collection ) {
        return this.collection.findByName(this.get('super_type')).isA( typeName );
      } else {
        return false;
      }
    }
  }
});

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
  findByName: function(name) {
    return this.find(function(type) {
      if(type.get('name').toLowerCase() === name.toLowerCase()) {
        return true;
      } else {
        return false;
      }
    }, this);
  },
});