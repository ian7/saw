/*global App,Backbone,JST,_,jQuery */

App.module('main.analytics',function(){
    this.Router = Backbone.SubRoute.extend({
    routes: {
        "" :            "index",
        "table" :     "table"
    },
    initialize : function(options){
        this.context = options.context;
        },
    index: function() {         
        this.context.dispatch("capture:issues:list");
        },
    table : function(){
        console.log('table');
        var element = jQuery("div#layout");

        alert('now');
    }
    });
});
