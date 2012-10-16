/*global App, Backbone,_,jQuery*/

App.module("main.projects",function(){
    this.startWithApp = true;
    this.Views = {};
    this.Commands = {};
    this.Context = Backbone.Marionette.Geppetto.Context.extend({
        initialize : function(){
            _(this).bindAll();
            this.projects = new App.Models.Project();
            this.projects.url = "/projects";

        //    this.mapCommand( "projects:fetch", this.index );
           // this.mapCommand( "projects:index", this.showIndex );
             this.listen("projects:index",this.showIndex );

        },
        showIndex : function() {
          console.log('rendering projects index');
            //this.context.options.view.render();
        
            this.mainView = new App.main.projects.Views.ProjectList( {context: this } );
        
            App.main.layout.central.show( this.mainView )
            this.projects.clear();
            this.projects.fetch();
        },
/*        showIndex : Backbone.Marionette.Geppetto.Command({
            execute : function(){
              console.log('rendering projects index');
                //this.context.options.view.render();
                App.main.layout.central.show( this.context.options.view )
                this.context.projects.clear();
                this.context.projects.fetch();
            }
        }),*/
        fetch : Backbone.Marionette.Geppetto.Command({
            execute : function(){
                console.log('fetching projects');
                this.context.projects.clear();
                this.context.projects.fetch();

            }
        })
        
    });
    this.start = function(){
        // layout needs to go first, because it creates the context
        this.context = new this.Context({parentContext: App.main.context});
        this.router = new this.Router("projects",{context: this.context});
        //this.context.dispatch('types:fetch');
    };
});


