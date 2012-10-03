/*global App,Backbone,JST,_,jQuery */
App.module('projects',function(){
    this.Router = Backbone.SubRoute.extend({
       routes: {
            "" :            "index"
        },
        initialize : function(args){
            this.context = args.context;
            },
        index: function() {         
            this.context.dispatch("projects:index");
            }
    });
});


/*


   App.Controllers.Project = Backbone.Router.extend({
 

   
    });

    */