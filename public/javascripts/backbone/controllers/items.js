/**
 * @author Marcin Nowak
 */
App.Controllers.Items = Backbone.Controller.extend({
    routes: {
        "/:id":            "show",
        "":                         "index",
        "new":                      "newDoc"
    },
    
    show: function(id) {
        var item = new Item({ id: id });
        item.fetch({
            success: function(model, resp) {
                new App.Views.Show({ item: item });
            },
            error: function() {
                new Error({ message: 'Could not find that document.' });
                window.location.hash = '#';
            }
        });
    },
    
    index: function() {
        jQuery.getJSON('/items', function(data) {
            if(data) {
                var items = _(data).map(function(i) { return new Item(i); });
                new App.Views.Index({ items: items });
            } else {
                new Error({ message: "Error loading documents." });
            }
        });
    },
    
    newDoc: function() {
        new App.Views.Edit({ model: new Document() });
    }
});


  window.WEB_SOCKET_SWF_LOCATION = "http://localhost:8080/WebSocketMain.swf"
 var options = new Array();
 //options['host']='juggernaut.sonyx.net';

  var jug = new Juggernaut( options );
  jug.subscribe("/chats", function(data){
    var li = $("<li />");
    li.text(data);
    $("#chats").append(li);
//	$("#whatever").append(data+"<br/>")alert
	//store.reload();
	alert(data);
  });  

