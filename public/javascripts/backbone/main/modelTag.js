/*global Backbone,App,_*/

App.Models.Tag = App.Data.Item.extend({
    initialize : function( model ){
      _(this).bindAll();

      App.Models.Project.__super__.initialize.apply(this);
      this.getRelationsFrom();
    },
   
});

App.Models.Tags = App.Data.Collection.extend({
    model: App.Models.Tag,
    /* default url is set to "projects" root - sub-projects are to be loaded recursively */
    url: "/tags"
});