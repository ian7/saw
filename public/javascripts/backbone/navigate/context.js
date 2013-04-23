/*global App, Backbone,_,jQuery*/

App.module("main.navigate",function(){
    this.Context = Backbone.Marionette.Geppetto.Context.extend({
        initialize : function(){
            _(this).bindAll();

            this.listen("navigate:issues:list",this.onIssueList);
            this.listen("navigate:issues:details",this.onIssueDetails);
        },
        onIssueList: function(){
            this.dispatchGlobally('mode:navigate');
            // create the view
            var view = new App.main.decide.Views.IssueList({collection: App.main.context.issues, context: this });
            // show it!
            App.main.layout.central.show(view);
        },
        onIssueDetails : function() {
            this.dispatchGlobally('mode:navigate');
            // create the view
            var view = new App.main.decide.Views.IssueDetails({model: this.issue, context: this});
            App.main.layout.central.show(view);
        },
// end of class
});
// end 
});
