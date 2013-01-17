/*global App,Backbone,JST,_,jQuery */
App.module('main.projects',function(){
    this.Router = Backbone.SubRoute.extend({
       routes: {
            "" :            "index",
            ":id/capture" : "projectCapture",
            ":id/details" : "projectDetails"
        },
        initialize : function(args){
            this.context = args.context;
            },
        index: function() {         
            this.context.dispatch("projects:index");
            },
        projectCapture : function( id ){
            this.parentContext.dispatch("projects:selected",{id:id});
        },
        projectDetails : function( id ){
            this.context.dispatch("projects:details",{id:id});
        }
    });
});


