/*global Backbone,jQuery */

jQuery(function() {
   jQuery("body").ajaxError(function(event, request, settings){
    if( request.status === 401 ) {
        localStorage.setItem('SAWurl',window.location.href);
        alert( "You are not logged in!" );
        window.location.href="/users/sign_in";
        }
   });
});

var SoftwareArchitectureWarehouse = Backbone.Marionette.Application.extend({
    Views: {},
    Models: {},
    Data: {},
    init: function() {
        // new App.Controllers.Project();      
        //this.addInitializer( this.startHistory );
        // that's slightly akward, but does the job.
        this.addRegions({mainRegion: 'body'});
        this.router = new this.main.Router();
        this.start();
        Backbone.history.start(/*{silent: true}*/);        
        //this.resources.start();
    },
    startHistory : function(){
    }    
});

var App = new SoftwareArchitectureWarehouse();