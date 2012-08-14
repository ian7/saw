/**
 * @author Marcin Nowak
 */
App.init = function() {
        app = new App.Controllers.Project();      
        Backbone.history.start();
    };
