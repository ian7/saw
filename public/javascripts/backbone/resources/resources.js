/*global App, Backbone,_*/


App.module("resources",function(){
    this.startWithApp = true;
    this.Views = {};
    this.Commands = {};

    this.context = Backbone.Marionette.Geppetto.Context.extend({
        initialize : function(){
            //this.mapCommand("do_something", commandAlert  );
            this.mapCommand( "types:fetch", this.fetchTypes );
            _(this).bindAll();
        },
        types : new App.Models.Types(),

        fetchTypes : Backbone.Marionette.Geppetto.Command.extend({
            execute : function(){
                this.context.types.fetch();
            }
        })
    });

    this.start = function(){
        this.layout = new this.Views.Layout();
        this.layout.start();
    };
});


