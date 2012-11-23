/*global App,Backbone,JST,_,jQuery */
App.module('main.resources',function(){
    this.Router = Backbone.SubRoute.extend({
    routes: {
        "" :            "index",
        "events" : "events"
    },
    initialize : function(args){
        this.context = args.context;
        },
    index: function() {         
        this.context.dispatch('router:index');        
        //this.context.dispatch('');        
        },
    events : function() {
        this.context.dispatch("resources:events");
        }
    });
});
