/*global App,Backbone,JST */

App.module('main.resources',function(){
    this.Views.Layout = Backbone.Marionette.Layout.extend({
        initialize : function(){           
            Backbone.Marionette.Geppetto.bindContext({
                view: this,
                context: App.main.resources.context,
                parentContext: App.main.context
                });
        },
        template : JST['resources/resourcesLayout'],
        el: "div#layout div#trunk div#center",
        regions : {
            types:{
                selector: "div#types"
            },
            items:{
                selector: 'div#items'
            }
        },
        start : function(){
            this.render();
            var tl = new App.main.resources.Views.TypeList({context: this.context});
            var il = new App.main.resources.Views.ItemList({context: this.context});
            this.types.show( tl );
            this.items.show( il );
            //tl.collection.fetch();
            
            //this.context.dispatch("types:fetch");
            //this.context.listen("type:clicked",this.onTypeClicked);
        },
        onTypeClicked : function(){

        }
    });
});