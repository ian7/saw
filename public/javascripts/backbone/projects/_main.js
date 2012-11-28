/*global App, Backbone,_,jQuery, eventer*/

App.module("main.projects", function() {
    this.startWithApp = true;
    this.Views = {};
    this.Commands = {};
    this.Context = Backbone.Marionette.Geppetto.Context.extend({
        initialize: function() {
            _(this).bindAll();
            this.projects = new App.Models.Project();
            this.projects.url = "/projects";

            this.listen("projects:index", this.showIndex);
            this.listen("projects:new", this.newProject);

            // this context is specific, becuase I would like it to reload list of projects if new one is created or deleted
            eventer.register(this);

            // find if there was some active project from previous session
            var lastProjectId = localStorage.getItem("project.lastId");
           if(lastProjectId && lastProjectId !== 'undefined') {
                this.dispatchGlobally("project:selected", {
                    id: lastProjectId
                });

            }
        },
        notifyEvent: function(data) {
            var e = JSON.parse(data);


            if(e.type === 'Project') {
                if(e.event === 'create' || e.event === 'destroy') {
                    this.projects.clear();
                    this.projects.fetch();
                }
            }
        },
        showIndex: function() {
            console.log('rendering projects index');
            //this.context.options.view.render();
            this.mainView = new App.main.projects.Views.ProjectList({
                context: this
            });

            App.main.layout.central.show(this.mainView);
            this.projects.clear();
            this.projects.fetch();
        },
        fetch: Backbone.Marionette.Geppetto.Command({
            execute: function() {
                console.log('fetching projects');
                this.context.projects.clear();
                this.context.projects.fetch();
            }
        }),
        newProject: function() {
            this.newProjectView = new App.main.projects.Views.NewProject({
                context: this
            });
            App.main.layout.modal.show(this.newProjectView);
        }

    });
    this.start = function() {
        // layout needs to go first, because it creates the context
        this.context = new this.Context({
            parentContext: App.main.context
        });
        this.router = new this.Router("projects", {
            context: this.context
        });
        //this.context.dispatch('types:fetch');
    };
});