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
        new App.Controllers.Project();      
        Backbone.history.start();
    }
};
