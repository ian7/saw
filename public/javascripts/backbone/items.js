/**
 * @author Marcin Nowak
 */
App.init = function() {
        this.Components.Items = this.controller = new App.Controllers.Items();  
        Backbone.history.start();
    };





