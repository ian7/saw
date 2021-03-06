/*global App, Backbone,_,jQuery*/


App.module("main.resources",function(){
    this.startWithApp = true;
    this.Views = {};
    this.Commands = {};
 
    this.context = Backbone.Marionette.Geppetto.Context.extend({
        initialize : function(){
            //this.mapCommand("do_something", commandAlert  );
//            this.mapCommand( "router:index", this.showIndex );
            this.mapCommand( "types:fetch", this.fetchTypes );
            this.mapCommand( "router:index", this.index );

            this.listen( "resources:events",this.events );

            _(this).bindAll();
        },
        types : new App.Models.Types(),
        fetchTypes : Backbone.Marionette.Geppetto.Command({
            execute : function(){
                // show up the spinner...
                this.context.types.fetch();
            }
        }),
        index : Backbone.Marionette.Geppetto.Command({
            execute : function(){
                console.log('been here!');
                this.context.options.view.start();
            }
        }),
        events : function(){
            var view = new App.main.resources.Views.Events( {context:this} );
            App.main.layout.central.show( view );
        }
    });

    this.start = function(){
        // layout needs to go first, because it creates the context
        this.layout = new this.Views.Layout();
        this.router = new this.Router("resources",{context: this.layout.context});
        this.context = this.layout.context;
        this.context.dispatch('types:fetch');
    };
});


