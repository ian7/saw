/*global App, Backbone,_,jQuery, eventer*/

App.module("main.projects", function() {
    this.startWithApp = true;
    this.Views = {};
    this.Commands = {};
//    this.Context = 
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