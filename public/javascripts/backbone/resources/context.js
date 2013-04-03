
App.module("main.resources",function(){
      this.context = Backbone.Marionette.Geppetto.Context.extend({
        initialize : function(){
            _(this).bindAll();
            //this.mapCommand("do_something", commandAlert  );
//            this.mapCommand( "router:index", this.showIndex );
            this.mapCommand( "types:fetch", this.fetchTypes );
            this.listen( "router:index", this.index );
            this.listen( "resources:events",this.events );

        },
        types : new App.Models.Types(),
        fetchTypes : Backbone.Marionette.Geppetto.Command({
            execute : function(){
                // show up the spinner...
                this.context.types.fetch();
            }
        }),
        index : function(){
                console.log('been here!');
                //this.context.options.view.start();
                var view = this.layout;
                App.main.layout.central.show( view );
        },
        events : function(){
            var view = new App.main.resources.Views.Events( {context:this} );
            App.main.layout.central.show( view );
        }
    });
});
    