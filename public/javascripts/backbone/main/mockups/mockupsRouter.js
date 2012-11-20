/*global App,Backbone,JST,_,jQuery */

App.module('main.mockups',function(){
    this.Router = Backbone.SubRoute.extend({
    routes: {
        "" : "index",
        "tagSelector" : "tagSelector"
    },
    initialize : function(options){
        this.context = options.context;
    },
    index: function() {         
    },
    tagSelector : function(){
        var widget = App.main.Views.TagSelector;
        var sandbox = new App.main.mockups.Views.MockupSandbox({context: this.context, widget: widget });
        App.main.layout.central.show(sandbox);
    }
    });
});
