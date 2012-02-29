var App = {
    Views: {
    	Rs: {},
        Ts: {},
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
        //this.Components.Items = this.controller = new App.Controllers.Items();
        this.Components.Rs = this.controller = new App.Controllers.Rs();
//		new App.Controllers.Tags();
        Backbone.history.start();
    }
};