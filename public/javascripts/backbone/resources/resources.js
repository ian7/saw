/*global App, Backbone*/

App.module("resources",function(){
    this.startWithApp = true;
    this.Views = {};
     
    // i need a context here!

    this.define = function(){
        alert('module init');
    };
    this.context = Backbone.Marionette.Geppetto.Context.extend({
        initialize : function(){
            //this.mapCommand("do_something", commandAlert  );
            this.types.fetch();
        },
        types : new App.Models.Types()
    });

    this.start = function(){
        this.layout = new this.Views.Layout();
        
        this.layout.render();
        this.layout.types.show( new this.Views.TypeList() );
    };
});


