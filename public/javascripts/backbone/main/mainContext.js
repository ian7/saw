/*global App, Backbone,_*/

App.module("main",function(){
    this.Context = Backbone.Marionette.Geppetto.Context.extend({
        initialize : function(){
            _(this).bindAll();
        },
        // this is going to store actual project reference
        project : null
    });
});
