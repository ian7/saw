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
                        
        initialize : function(){
            _(this).bindAll();
            this.listen("project:selected",this.projectSelected);
            this.project = new App.Models.Project();

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

            this.issues = new App.Models.Issues();

            // checking juggernaut connectivity
            jug.on("connect",this.updateStatus);
            jug.on("disconnect",this.updateStatus);

            this.setStatus( App.main.Status.loading );
            this.on("status:ready",this.onStatusReady,this);

            this.on("item:selected",this.itemSelected,this);

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
            this.project.url = "/projects/"+args.id;
            this.project.fetch();

           // window.history.pushState("project","project",window.location.origin + "/#project/" + args.id);
            localStorage.setItem("project.lastId",args.id);
        },
        getTypes : function( rootType, collection  ){
//            this.types.where( {name = rootName });

        },
        itemSelected : function( item ){
            var relationsToItem = item.getRelationsTo();

            this.tagListWidget = new App.main.Views.TagListWidget({context:this, collection : relationsToItem, model: item  });
            App.main.layout.tagSidebar.show( this.tagListWidget );            
        }
    });
});
