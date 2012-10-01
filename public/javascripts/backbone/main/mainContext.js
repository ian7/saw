/*global App, Backbone,_*/

App.module("resources",function(){
    this.context = Backbone.Marionette.Geppetto.Context.extend({
        initialize : function(){
            _(this).bindAll();
        },
        // this is going to store actual project reference
        project : null
    });
});
