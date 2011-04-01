/**
 * @author Marcin Nowak
 */
var App = {
    Views: {},
    Controllers: {},
    init: function() {
        new App.Controllers.Items();
        Backbone.history.start();
    }
};