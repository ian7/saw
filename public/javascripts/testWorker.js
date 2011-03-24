
onmessage = function(event) {
  var method = event.data[0];

  if (method == "init") {
    var args = event.data[1];

    var listener = {
      onNewMin: function(p) {
        postMessage(["onNewMin", p]);
      },
      onDone: function(p) {
        postMessage(["onDone", p]);
      }
    };

  }
  if (method == "go") {
  }
}