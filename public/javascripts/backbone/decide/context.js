/*global App, Backbone,_,jQuery*/

App.module("main.decide",function(){
    this.Context = Backbone.Marionette.Geppetto.Context.extend({
        initialize : function(){
            _(this).bindAll();

            this.listen("decide:issues:list",this.onIssueList);
            this.listen("decide:issues:details",this.onIssueDetails);
        },
        onIssueList: function(){
            this.dispatchGlobally('mode:decide');
            // create the view
            var view = new App.main.decide.Views.IssueList({collection: App.main.context.issues, context: this });
            // show it!
            App.main.layout.central.show(view);
        },
        onIssueDetails : function() {
            this.dispatchGlobally('mode:decide');
            // create the view
            var view = new App.main.decide.Views.IssueDetails({model: this.issue, context: this});
            App.main.layout.central.show(view);
        },
// end of class
});
// end 
});
