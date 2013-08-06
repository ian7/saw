/*global App, Backbone,_,jQuery*/

App.module("main.analytics",function(){
    this.Context = Backbone.Marionette.Geppetto.Context.extend({
        initialize : function(){
            _(this).bindAll();

            this.listen("analyze:index",this.onIndex);
            this.listen("analyze:issue",this.onIssue);
            this.listen("analyze:alternative",this.onAlternative);
            this.on('history:pop',this.onHistoryPop,this);

        },
        onHistoryPop : function( viewState ){
            switch( viewState.dialog ){
                case 'main.analytics.index':
                    this.trigger('analyze:index',{ projectAid: viewState.projectAid, projectBid: viewState.projectBid });
//                    this.trigger('capture:issues:details');
                    break;
                case 'main.analytics.issue':
                    this.trigger('analyze:issue', {projectAid: viewState.projectAid, projectBid: viewState.projectBid, issueIndex: viewState.issueIndex });
                    break;
                case 'main.analytics.alternative':
                    this.trigger('analyze:alternative', {projectAid: viewState.projectAid, projectBid: viewState.projectBid, issueIndex: viewState.issueIndex, alternativeIndex: viewState.alternativeIndex});                	
                default:
                    break;
            }

        },
        onIndex : function(options) {
            this.dispatchGlobally('mode:analytics');
			
			if (options){
            	var view = new App.main.analytics.Views.Index({context: this, projectAid : options.projectAid, projectBid : options.projectBid });
            }
            else {
              	var view = new App.main.analytics.Views.Index({context: this });
            } 
            
            App.main.layout.central.show( view );
        },
        onIssue : function(options) {
            this.dispatchGlobally('mode:analytics');		
            
            var view = new App.main.analytics.Views.Issue({context: this, projectAid : options.projectAid, projectBid : options.projectBid, issueIndex: options.issueIndex});
            App.main.layout.central.show( view );
        },
        onAlternative : function(options) {
            this.dispatchGlobally('mode:analytics');		
            
            var view = new App.main.analytics.Views.Alternative({context: this, projectAid : options.projectAid, projectBid : options.projectBid, issueIndex: options.issueIndex, alternativeIndex: options.alternativeIndex});
            App.main.layout.central.show( view );
        }
        
// end of class
    });
// end 
});
