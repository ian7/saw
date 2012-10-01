/*global App,Backbone,JST */

App.module('resources',function(){
    this.Views.Layout = Backbone.Marionette.Layout.extend({
        initialize : function(){           
        Backbone.Marionette.Geppetto.bindContext({
            view: this,
            context: App.resources.context
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
            var tl = new App.resources.Views.TypeList({context: this.context});
            var il = new App.resources.Views.ItemList({context: this.context});
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