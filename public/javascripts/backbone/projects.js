/**
 * @author Marcin Nowak
 */
var App = {
    Views: {
    	Tags: {},
    	Alternatives: {},
		Items: {},
		Projects: {},
		Decisions: {},
    },
    Controllers: {},
    Components: {},
    Helpers: {},
    init: function() {
        new App.Controllers.Project();      
        Backbone.history.start();
    }
};
