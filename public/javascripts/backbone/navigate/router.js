/*global App,Backbone,JST,_,jQuery */

App.module('main.navigate',function(){
    this.Router = Backbone.SubRoute.extend({
    routes: {
        "" :            "index",
        "project/:id" : "withProject",
        "project/:project_id/issue/:issue_id" : "showIssue",
        "issueReuse" :   "issueReuse",
        "alternativeReuse" : "alternativeReuse",
        "itemRelate" : "itemRelate"
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
        },
    alternativeReuse : function(){
        this.context.dispatchToParent("project:selected",{id:'4faa2716924ff85a52000001'});        
        this.context.dispatch("issue:selected",{id:'4faa69f7924ff85c1200000b'});
        this.context.dispatch("capture:alternatives:reuse");
    },
    itemRelate : function(){
        this.context.dispatch("capture:item:relate");        
    }
    });
});
