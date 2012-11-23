/*global App,Backbone,JST,_ */

App.module('main',function(){
    this.Views.Landing = Backbone.Marionette.ItemView.extend({
        className : 'landingWidget',
        tagName : 'div',
        template : JST['main/landing'], 
        initialize : function(){
            // hook up to the routing events
            _(this).bindAll();
        },  
        onRender : function(){
            //debugger;
        }
    });
});