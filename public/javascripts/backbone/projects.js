/**
 * @author Marcin Nowak
 */
App.init = function() {
        new App.Controllers.Project();      
        Backbone.history.start();
    };
