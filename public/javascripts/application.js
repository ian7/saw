/*global Backbone,jQuery,google */

var debug = {};
var config = {
    localStorageLimit : 2000
};

cleanUpCache = function(){
        var delta = localStorage.length - config.localStorageLimit;
        
        if( delta < 0 ){
            //console.log( "no cleanup needed" )
            return true;
        }else{
            console.log( "cleanup of: "+delta+" entries");
        }
        
        //var delta = 10;
        var recycler = {};


        var latestStamp = null;
        var latestKey = null;

        _(localStorage).each( function( value, key ){
            
            var keyId = localStorage.key( key );
            if( keyId.match("^s") ){
                //alert(keyId);

                var stampValue = localStorage.getItem( keyId );

                // we don't actually need the "s" any more
                keyId = keyId.substring(1);

                if( Object.keys(recycler).length < delta ){
                    recycler[keyId] = stampValue;

                    if( latestStamp === null || latestStamp < stampValue ){
                        latestStamp = stampValue;
                        latestKey = keyId;
                    }
                }
                else {
                    //debugger
                    // trash existing recycler entry
                    delete recycler[latestKey];
                    latestStamp = null;

                    // add the new one 
                    recycler[ keyId ] = stampValue;

                    //  first find the id with the last stamp again
                    _(recycler).each( function( value, key ){

                        if( latestStamp === null || latestStamp < stampValue ){
                            latestStamp = stampValue;
                            latestKey = keyId;
                        }
                    },this);
                }
            }
        },this);

        
        // and finally trash it. 
        _(recycler).each( function(value, key){
            localStorage.removeItem('r'+key);
            localStorage.removeItem('i'+key);
            localStorage.removeItem('s'+key);
         });
         
    };
jQuery("body").everyTime(2000,'recycle cache',cleanUpCache);

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
if( typeof(google) !== 'undefined' ) {
    google.load("visualization", "1", {packages:["corechart"]});
}

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