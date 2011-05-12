/**
 * @author Marcin Nowak
 */
var App = {
    Views: {
    	Tags: {},
    	Alternatives: {},
		Decisions: {},
		Items: {},
		Relations: {},
		Projects: {},
    },
    Controllers: {},
    Components: {},
    Helpers: {},
    init: function() {
        new App.Controllers.Project();      
        Backbone.history.start();
    }
};
