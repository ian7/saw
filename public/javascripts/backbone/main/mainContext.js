/*global App, Backbone,_*/

App.module("main",function(){
    
    this.Status = {
        loading :       { name: "Loading", ready : false },
        ready :         { name: "Ready", ready: true },
        disconnected :  { name: "Dosconnected", ready: false},
        closing :       { name: "Closing", ready: false},
        crashed :       { name: "Crashed", ready: false}
    };

    this.Context = Backbone.Marionette.Geppetto.Context.extend({

        // this is going to store actual project reference
        project : null,

        // this should be later replaced by the DynamicType equivalent
        decisions : new App.Data.Collection(),

        // all data types go here:
        types : null, //new App.Data.Types(),

        // same with tags...
        tags : null, //new App.Models.Tags(),

        // application loading status
        status : null,
                        
        initialize : function(){
            _(this).bindAll();
            this.listen("project:selected",this.projectSelected);
            this.project = new App.Models.Project();

            // having a list of decision tags within the main scope appears to be reasonable.
            this.decisions.url = "/scope/type/Decision";
            this.decisions.fetch();

            // for the same reason having list of the data
            this.types = new App.Models.Types();
            this.types.fetch();
            this.types.on( 'reset',this.updateStatus,this );

            this.tags = new App.Models.Tags();
            this.tags.fetch();
            this.tags.on('reset', this.updateStatus, this);

            this.setStatus( App.main.Status.loading );
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

            this.setStatus( App.main.Status.ready );
        },
        projectSelected : function( args ){
            this.project.url = "/projects/"+args.id;
            this.project.fetch();
        },
        getTypes : function( rootType, collection  ){
//            this.types.where( {name = rootName });

        }
    });
});
