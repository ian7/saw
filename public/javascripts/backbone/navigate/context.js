/*global App, Backbone,_,jQuery*/

App.module("main.navigate",function(){
    this.Context = Backbone.Marionette.Geppetto.Context.extend({
        initialize : function(){
            _(this).bindAll();

            this.listen("navigate:start",this.onIssueList);
            this.listen("navigate:move",this.onMove);
            this.listen("navigate:issues:details",this.onIssueDetails);
            this.listen('navigate:item:shot',this.onItemShot);
            this.listen('history:pop',this.onHistoryPop);
        },
        onHistoryPop : function( viewState ){
            switch( viewState.dialog ){
                case 'main.navigate.item':
                    this.trigger('navigate:start');
                    this.trigger('navigate:move',viewState.itemId );
                    break;
                default:
                    break;
            }

        },
        onIssueList: function( model ){
            this.dispatchGlobally('mode:navigate');

            var item = model;

            if( !item ){
                item = App.main.context.project;
            }

            // create the view        
            this.view = new App.main.navigate.Views.Item({model : item, context: this });
            // show it!
            App.main.layout.central.show(this.view);
        },
        onIssueDetails : function() {
            this.dispatchGlobally('mode:navigate');
            // create the view
            var view = new App.main.decide.Views.IssueDetails({model: this.issue, context: this});
            App.main.layout.central.show(view);
        },
        onMove : function( newId ) {
            this.view.model.set('id',newId );
            this.view.model.fetch();
        },
        onItemShot  :function( model ){
            if( model.get('type') === 'Issue' ){
                this.dispatchGlobally('issue:selected',{id:model.get('id')});
                this.dispatchGlobally('capture:issues:details');
            }
            if( model.get('type') === 'Project' ){
                this.dispatchGlobally('capture:issues:list');
            }
            if( model.get('type') === 'Alternative' ){
                var sbRelation = (model.getRelationsFrom()).find( function( relation ){
                    return( relation.get('relation') === 'SolvedBy');
                },this);
                if( sbRelation ) {
                    this.dispatchGlobally('issue:selected',{id:sbRelation.get('tip')});
                    this.dispatchGlobally('capture:issues:details');
                    this.dispatchGlobally('capture:focusRequested',model.get('id'));
                }
            }

        }
// end of class
});
// end 
});
