/*global App, Backbone,_,jQuery*/

App.module("main.analytics",function(){
    this.Context = Backbone.Marionette.Geppetto.Context.extend({
        initialize : function(){
            _(this).bindAll();

            this.listen("analyze:index",this.onIndex);
            this.listen("analyze:issue",this.onIssue);
            this.listen("analyze:alternative",this.onAlternative);
        },
        onIndex : function() {
            this.dispatchGlobally('mode:analytics');

            var view = new App.main.analytics.Views.Index({context: this});
            App.main.layout.central.show( view );
        },
        onIssue : function(options) {
            this.dispatchGlobally('mode:analytics');		
            
            var view = new App.main.analytics.Views.Issue({context: this, issueIndex: options.issueIndex, D3nodes: options.D3nodes});
            App.main.layout.central.show( view );
        },
        onAlternative : function(options) {
            this.dispatchGlobally('mode:analytics');		
            
            var view = new App.main.analytics.Views.Alternative({context: this, issueIndex: options.issueIndex, alternativeIndex: options.alternativeIndex, D3nodes: options.D3nodes});
            App.main.layout.central.show( view );
        }
        
// end of class
    });
// end 
});
