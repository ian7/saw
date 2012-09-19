window.WEB_SOCKET_SWF_LOCATION = "http://"+ window.location.hostname +":8080/WebSocketMain.swf"
 
 // Settin host to external machine
var options = new Array();
//options['host']='juggernaut.sonyx.net';
/*
if( window.location.port == "" ) {
	options['port'] = 80;
}
else {
	options['port'] = window.location.port;
}
*/
var jug = new Juggernaut( options );

jug.subscribe("/chats", function(data){
	notifier.notify(data);
});  

jug.subscribe("channel1", function(data){
	eventer.notify(data);
});  


var notifier = {
	listeners : [],
	register : function( o ) {
		this.listeners.push(o);
	},
	unregister : function ( o ) {
		this.listeners = _.without( this.listeners, o );
	},
	notify : function( data ) {
		_.each( this.listeners, function( l ){
			if( l.notify ) {
				l.notify( data );
			}
		});
	},	
};

var eventer = {
	listeners : [],
	register : function( o ) {
		this.listeners.push(o);
	},
	unregister : function ( o ) {
		this.listeners = _.without( this.listeners, o );
	},
	notify : function( data ) {
		_.each( this.listeners, function( l ){
			if( l.notifyEvent ) {
				l.notifyEvent( data );
			}
		});
	},		
};
