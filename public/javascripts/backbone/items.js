/**
 * @author Marcin Nowak
 */
var App = {
    Views: {
    	Tags: {},
    	Alternatives: {},
		Decisions: {},
		Items: {},
		Relations: {},
		Projects: {},
		Rs: {},
		Ts: {},
    },
    Controllers: {},
    Components: {},
    Helpers: {},
    init: function() {
        this.Components.Items = this.controller = new App.Controllers.Items();
      
//		new App.Controllers.Tags();
        Backbone.history.start();
    }
};
/*
window.WEB_SOCKET_SWF_LOCATION = "http://localhost:8080/WebSocketMain.swf"
 
 // Settin host to external machine
var options = new Array();
//options['host']='juggernaut.sonyx.net';
var jug = new Juggernaut( options );

jug.subscribe("/chats", function(data){
	notifier.notify(data);
});  

var notifier = {
	listeners : [],
	register : function( o ) {
		this.listeners.push(o);
	},
	notify : function( data ) {
		_.each( this.listeners, function( l ){
			if( l.notify ) {
				l.notify( data );
			}
		});
	},	
};

*/




