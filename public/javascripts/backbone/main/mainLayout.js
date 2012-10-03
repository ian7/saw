/*global App,Backbone,JST */

App.module('main',function(){
    this.Views.Layout = Backbone.Marionette.Layout.extend({
        initialize : function(){           
        Backbone.Marionette.Geppetto.bindContext({
            view: this,
            context: App.main.Context
            });
        },
        /* after layout is rendered, we could furnish it with some widgets: */
        onRender : function(){
            this.ribbonView = new App.main.Views.Ribbon({context:this.context});
            this.ribbon.show( this.ribbonView );
        },
        template : JST['main/mainLayout'],
        el: 'body',
        regions: {
            layout: '#layout',
            ribbon: "#ribbon",
            content: "#center",
            leftSidebar: "#leftSidebar",
            rightSidebar: "#rightSidebar",
            notificationSidebar: '#notificationSidebar',
            tagSidebar: '#tagSidebar',
            speedButtonsSidebar: '#speedButtonsSidebar',
            modal : {
                selector: 'div#modal',
                regionType: this.Regions.Modal
                }
        },
        start : function(){
            this.render();
        }
    });
});