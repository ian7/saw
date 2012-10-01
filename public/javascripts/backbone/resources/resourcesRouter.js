/*global App,Backbone,JST,_,jQuery */
App.module('resources',function(){
    this.Router = Backbone.SubRoute.extend({
    routes: {
        "" :            "index"
    },
    initialize : function(args){
        this.context = args.context;
        },
    index: function() {         
        this.context.dispatch('router:index');        
        //this.context.dispatch('');        
        }
    });
});
