/*global App,Backbone,JST,_,jQuery */

App.module('main.capture',function(){
    this.Router = Backbone.SubRoute.extend({
    routes: {
        "" :            "index",
        "project/:id" : "withProject"
    },
    initialize : function(options){
        this.context = options.context;
        },
    index: function() {         
        this.context.dispatch("capture:issues:list");
        },
    withProject : function( id ){
        this.context.dispatchToParent("project:selected",{id:id});
        this.index();
       }
    });
});
