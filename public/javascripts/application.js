/*global Backbone */

var SoftwareArchitectureWarehouse = Backbone.Marionette.Application.extend({
    Views: {},
    Models: {},
    init: function() {
        // new App.Controllers.Project();      
        //this.addInitializer( this.startHistory );
        // that's slightly akward, but does the job.
        this.addRegions({mainRegion: 'body'});
        this.router = new this.main.Router();
        this.start();
        Backbone.history.start({silent: true});        
        //this.resources.start();
    },
    startHistory : function(){
    }    
});

var App = new SoftwareArchitectureWarehouse();