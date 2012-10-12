/*global App,Backbone,JST,_,jQuery */
App.module('projects',function(){
    this.Router = Backbone.SubRoute.extend({
       routes: {
            "" :            "index",
            ":id/capture" : "projectCapture"
        },
        initialize : function(args){
            this.context = args.context;
            },
        index: function() {         
            this.context.dispatch("projects:index");
            },
        projectCapture : function( id ){
            this.parentContext.dispatch("projects:selected",{id:id});
        }
    });
});


