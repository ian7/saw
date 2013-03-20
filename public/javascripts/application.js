/*global Backbone,jQuery,google */

jQuery(function() {
   jQuery.ajaxSetup({
    global: true
   });
   jQuery("body").ajaxError(function(event, request, settings){

    // unauthorizedCaught prevents multiple authorization notifications
    if( request.status === 401 && typeof( unauthorizedCaught ) === 'undefined' ) {
        // this is intentionally global 
        unauthorizedCaught = true;

        localStorage.setItem('SAWurl',window.location.href);
        alert( "You are not logged in!" );
        window.location.href="/users/sign_in";
        }
   });
});

/* google charts initialization */
google.load("visualization", "1", {packages:["corechart"]});

/* this should sweep our session cache */
sessionStorage.clear();


var SoftwareArchitectureWarehouse = Backbone.Marionette.Application.extend({
    connectionsCount : 0,
    Views: {},
    Models: {},
    Data: {},
    init: function() {
        // new App.Controllers.Project();      
        //this.addInitializer( this.startHistory );
        // that's slightly akward, but does the job.
        this.addRegions({mainRegion: 'body'});
        this.router = new this.main.Router();
        if( typeof( localStorage.updateStamp ) == "undefined " ||
            localStorage.updateStamp == "undefined" ){
            localStorage.removeItem('updateStamp');
        }
        else {
        jQuery.ajax({ 
            url: "/updates/"+localStorage.updateStamp,
            success : function(data, status, xhr){
                console.log("received: " + data.length + " items to purge")
                _(data).each( function( itemID ){
                    if( localStorage.getItem('i'+itemID) ){
                        console.log('removing: i'+itemID );
                        localStorage.removeItem("i"+itemID );
                    }
                    if( localStorage.getItem('r'+itemID) ){
                        console.log('removing: r'+itemID );
                        localStorage.removeItem("r"+itemID );
                    }
                });
                }
            });
        }

        this.start();
        //Backbone.history.start(/*{silent: true}*/);        
        //this.resources.start();
    },
    startHistory : function(){
    },
    invalidateCache: function(){

    }
});

var App = new SoftwareArchitectureWarehouse();