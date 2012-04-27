App.init = function() {
        //this.Components.Items = this.controller = new App.Controllers.Items();
        this.Components.Rs = this.controller = new App.Controllers.Rs();
        Backbone.history.start();
    };