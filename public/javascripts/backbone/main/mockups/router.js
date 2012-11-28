/*global App,Backbone,JST,_,jQuery */

App.module('main.mockups',function(){
    this.Router = Backbone.SubRoute.extend({
    routes: {
        "" : "index",
        "tagSelector" : "tagSelector",
        "typeSelector" : "typeSelector",
        "itemSelector" : "itemSelector"
    },
    initialize : function(options){
        this.context = options.context;
    },
    index: function() {

    },
    tagSelector : function(){
        var widget = new App.main.Views.TagSelector( {context : this.context });
        var sandbox = new App.main.mockups.Views.MockupSandbox({context: this.context, widget: widget });
        
        App.main.layout.central.show(sandbox);
    },
    typeSelector : function(){

        var types = new Backbone.CollectionFilter( { collection: this.context.types, filter: { super_type: "Tag" }  });
        var widget = new App.main.Views.TypeSelector( { context: this.context, collection: types});
        var sandbox = new App.main.mockups.Views.MockupSandbox({ context: this.context, widget: widget });
        
        App.main.layout.central.show(sandbox);
    },
    itemSelector : function(){

        var types = new Backbone.CollectionFilter( { collection: this.context.types, filter: { super_type: "Tag" }  });
        var widget = new App.main.Views.ItemSelector( { context: this.context, collection: this.context.issues });
        var sandbox = new App.main.mockups.Views.MockupSandbox({ context: this.context, widget: widget });
        
        App.main.layout.central.show(sandbox);
    }

    });
});
