/*global App,Backbone,JST,_,jQuery */

App.module('main',function(){
    this.Views.Layout = Backbone.Marionette.Layout.extend({
        initialize : function(){           
            _(this).bindAll();
    
            // this needs to be set during the initialization due to missing Region type definitions during the load-up
            this.regions = {
                layout: '#layout',
                ribbon: "#ribbon",
                central: {
                    selector: "#central",
                    regionType: App.main.Regions.Central
                },
                leftSidebar: "#leftSidebar",
                rightSidebar: "#rightSidebar",
                notificationSidebar: '#notificationSidebar',
                tagSidebar: '#tagSidebar',
                speedButtonsSidebar: '#speedButtonsSidebar',
                modal : {
                    selector: 'div#modal',
                    regionType: App.main.Regions.Modal
                    }
            };

            // start with these regions
            this.reInitializeRegions();
            // create context. 
            Backbone.Marionette.Geppetto.bindContext({
                view: this,
                context: App.main.Context
            });
            jQuery('body').everyTime(30000,'updateClock',this.onClockTick);
        },
        /* after layout is rendered, we could furnish it with some widgets: */
        onRender : function(){
            this.ribbonView = new App.main.Views.Ribbon({context:this.context});
            this.ribbon.show( this.ribbonView );

            this.speedButtonsView = new App.main.Views.SpeedButtons({context:this.context});
            this.speedButtonsSidebar.show( this.speedButtonsView );

            this.notificationView = new App.main.Views.NotificationListWidget({context:this.context});
            this.notificationSidebar.show( this.notificationView );

            this.landingView = new App.main.Views.Landing({context:this.context});
            this.central.show( this.landingView );

            this.onClockTick();
        },
        template : JST['main/layout'],
        el: 'body',
        // regions needed to be moved to the initializer
        regions: null,
        start : function(){
            this.render();
        },
        onClockTick : function() {
            jQuery('div#clockSidebar span#time',this.el).html(Date().match("[0-9][0-9]:[0-9][0-9]"));
        }
    });
});