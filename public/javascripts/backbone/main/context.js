/*global App, Backbone,_,jug*/

App.module("main",function(){
    
    this.Status = {
        loading :       { name: "Loading", ready : false },
        connecting :    { name: "Connecting", ready: false},
        ready :         { name: "Ready", ready: true },
        disconnected :  { name: "Dosconnected", ready: false},
        closing :       { name: "Closing", ready: false},
        crashed :       { name: "Crashed", ready: false}
    };

    this.Context = Backbone.Marionette.Geppetto.Context.extend({

        // this is going to store actual project reference
        project : null,

        // this should be later replaced by the DynamicType equivalent
        decisions : null, //new App.Data.Collection(),

        // all data types go here:
        types : null, //new App.Data.Types(),

        // same with tags...
        tags : null, //new App.Models.Tags(),

        // application loading status
        status : null,

        // this used to be in the capture module... it needed to come here. 
        issues : null,

        // this goes up if there was a history pop recently
        popped : false,
                        
        initialize : function(){
            _(this).bindAll();
            this.listen("project:selected",this.projectSelected);
            this.project = new App.Models.Project();

            // maybe once I should load it from the localStorage
            this.history = [];
            this.lastHistoryPop = {};

            // having a list of decision tags within the main scope appears to be reasonable.
            this.decisions = new App.Data.Collection();
            this.decisions.url = "/scope/type/Decision";
            this.decisions.fetch();

            // for the same reason having list of the data
            this.types = new App.Models.Types();
            this.types.fetch();
            this.types.on( 'reset',this.updateStatus,this );

            this.tags = new App.Models.Tags();
            this.tags.fetch();
            this.tags.on('reset', this.updateStatus, this);

            //this.issues = new App.Models.Issues();
            this.relatedToProject = new App.Data.RelatedCollection( null, {
                direction: 'from',
                item: this.project,
                model: App.Models.Issue
                      //  filter: function( model ){
                      //      return( model.get('type')==='Issue');
                      //  }
                });
            this.relatedToProject.relations.on('add', function(){ console.log( 'relatedToProject added ' + this.relatedToProject.length );}, this);
            this.relatedToProject.relations.on('remove', function(){ console.log( 'relatedToProject removed ' + this.relatedToProject.length );}, this);
            this.relatedToProject.relations.on('reset', function(){ 
                console.log( 'relatedToProject reset ' + this.relatedToProject.length );
                //this.issues.collection.refreshExistingRelations();
            }, this);

            this.issues = new App.Data.FilteredCollection(null, {
                collection: this.relatedToProject,
                filter : function( model ){
                    return( model.get('type') === 'Issue');
                }
            });


            this.issues.collection.on('add', function(){ console.log( 'issues added ' + this.issues.length );}, this);
            this.issues.collection.on('remove', function(){ 
                console.log( 'issues removed ' + this.issues.length );
            }, this);
            this.issues.collection.on('reset', function(){ 
                console.log( 'issues reset ' + this.issues.length );
                this.issues.collection.refreshExistingRelations();
            }, this);

            // checking juggernaut connectivity
            jug.on("connect",this.updateStatus);
            jug.on("disconnect",this.updateStatus);

            this.setStatus( App.main.Status.loading );
            this.on("status:ready",this.onStatusReady,this);

            this.on("item:selected",this.itemSelected,this);

            this.on("history:push",this.onHistoryPush,this);
            this.on('history:pop',this.onHistoryPop,this);

            window.onpopstate = this.onBrowserHistoryPop;
        },
        setStatus : function( newStatus ){
            this.status = newStatus;
            this.vent.trigger( "status", newStatus );
            this.vent.trigger( "status:" + newStatus.name.toLowerCase() );
        },
        updateStatus : function(){
            if( this.tags.size() === 0 || this.types.size() === 0 ){
                this.setStatus(App.main.Status.loading);
                return;
            }

            if( jug.io.socket.connected === false ){
                this.setStatus(App.main.Status.connecting);
                return;
            }

            this.setStatus( App.main.Status.ready );
        },
        onStatusReady : function(){
            if( Backbone.history ) {
                Backbone.history.start(/*{silent: true}*/);        
            }
        },
        projectSelected : function( args ){
            if( !args || !args.id ){
                return;
            }
            this.project.set('id',args.id);
            this.project.url = "/projects/"+args.id;
            this.project.fetch();
            console.log( args.id );
           // window.history.pushState("project","project",window.location.origin + "/#project/" + args.id);
            localStorage.setItem("project.lastId",args.id);
            // switch views
            //this.dispatchGlobally("capture:issues:list");

        },
        getTypes : function( rootType, collection  ){
//            this.types.where( {name = rootName });

        },
        itemSelected : function( item ){
            /*var relationsToItem = item.getRelationsTo();

            this.tagListWidget = new App.main.Views.TagListWidget({context:this, collection : relationsToItem, model: item  });
            App.main.layout.tagSidebar.show( this.tagListWidget );            
            */
        },
        onHistoryPush : function( serializedView ){
            var historyItem = {};
            
            _.extend( historyItem, serializedView );
            _.extend( historyItem, { 
                project : this.project.get('id')
            });

            // first push after the pop should be surpressed

            if( this.popped ){
                console.log( 'history.push surpressed');
                this.popped = false;
                return;
            }

            // and let's put it on the stack
            //this.history.push(historyItem);
            if( JSON.stringify( history.state ) != JSON.stringify( historyItem ) &&
                JSON.stringify( this.lastHistoryPop ) != JSON.stringify( historyItem )) {


                var uri = '#/project/' + this.project.get('id');
                for (var key in serializedView) {
                  if (serializedView.hasOwnProperty(key)) {
                    uri = uri + '/' + key + '/' + serializedView[key];
                  }
                }

                history.pushState( historyItem, 'someTitle',uri);
                console.log('pushing: '+JSON.stringify(historyItem));
            }
            else{
                console.log('duplicate history state');
            }
        },
        onBrowserHistoryPop : function( event ){
             //alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
             if( event.state ){
                 console.log( event.state );
                 _.clone( this.lastHistoryPop, event.state );
                 this.popped = true;   

                 // dispatch it to the other contextes
                 this.dispatchGlobally('history:pop',event.state);
             }
        },
        onHistoryPop : function( viewState ){
             // we are loading the project here: 
             if( viewState.project ){
                if( viewState.project != this.project.get('id') ){
                    this.projectSelected( {id: viewState.project });
                }
             }
        }
    });
});
