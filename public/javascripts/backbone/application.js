/**
 * @author Marcin Nowak
 */
var App = {
    Views: {
    	Tags: {},
    	Alternatives: {}
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

window.WEB_SOCKET_SWF_LOCATION = "http://localhost:8080/WebSocketMain.swf"
 
 // Settin host to external machine
var options = new Array();
 //options['host']='juggernaut.sonyx.net';

  var jug = new Juggernaut( options );
  jug.subscribe("/chats", function(data){

/// that's crap 
//    var li = $("<li />");
//    li.text(data);
//    $("#chats").append(li);
//    $("#whatever").append(data+"<br/>")alert

/// some functionality
//store.reload();


/// just to show off
//	alert(data);
	App.controller.update(data);
	
  });  

