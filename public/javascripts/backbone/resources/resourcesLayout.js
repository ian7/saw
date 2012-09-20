/*global App,Backbone,JST */

App.module('resources',function(){
    this.Views.Layout = Backbone.Marionette.Layout.extend({
        template : JST.resourcesLayout,
        el: 'body',
        regions : {
            types:{
                selector: "div#types"
            },
            items:{
                selector: 'div#items'
            }
        }
    });
});