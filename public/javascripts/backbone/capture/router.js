/*global App,Backbone,JST,_,jQuery */

App.module('main.capture',function(){
    this.Router = Backbone.SubRoute.extend({
    routes: {
        "" :            "index",
        "project/:id" : "withProject",
        "project/:project_id/issue/:issue_id" : "showIssue",
        "issueReuse" :   "issueReuse"
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
        },
    showIssue : function( project_id, issue_id ){
        this.context.dispatchToParent("project:selected",{id:project_id});        
        this.context.dispatch("issue:selected",{id:issue_id});
        this.context.dispatch("capture:issues:details");
        },
    issueReuse : function(){
        this.context.dispatch("capture:issues:reuse");
        }
    });
});
