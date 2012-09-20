/*global Backbone */

var SoftwareArchitectureWarehouse = Backbone.Marionette.Application.extend({
    Views: {},
    Models: {},
    init: function() {
        // new App.Controllers.Project();      
        //this.addInitializer( this.startHistory );
        // that's slightly akward, but does the job.
        this.addRegions({mainRegion: 'body'});
        this.start();
        //this.resources.start();
    },
    startHistory : function(){
        Backbone.history.start();        
    }    
});

var App = new SoftwareArchitectureWarehouse();