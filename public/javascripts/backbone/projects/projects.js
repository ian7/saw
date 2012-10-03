/*global App, Backbone,_,jQuery*/

App.module("projects",function(){
    this.startWithApp = true;
    this.Views = {};
    this.Commands = {};
    this.context = Backbone.Marionette.Geppetto.Context.extend({
        initialize : function(){
            _(this).bindAll();
            this.projects = new App.Models.Project();
            this.projects.url = "/projects";

        //    this.mapCommand( "projects:fetch", this.index );
            this.mapCommand( "projects:index", this.showIndex );

        },
        showIndex : Backbone.Marionette.Geppetto.Command({
            execute : function(){
                console.log('rendering projects index');
                this.context.options.view.render();
                this.context.projects.fetch()
            }
        }),
        fetch : Backbone.Marionette.Geppetto.Command({
            execute : function(){
                console.log('fetching projects');
                this.context.projects.fetch();

            }
        }),
        
    });
    this.start = function(){
        // layout needs to go first, because it creates the context
        this.mainView = new this.Views.ProjectList();
        this.router = new this.Router("projects",{context: this.mainView.context});
        this.context = this.mainView.context;
        //this.context.dispatch('types:fetch');
    };
});


