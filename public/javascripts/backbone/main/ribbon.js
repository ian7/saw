/*global App,Backbone,JST,_,jQuery */

 
App.module('main',function(){
    this.Views.Ribbon = Backbone.Marionette.ItemView.extend({
        className : 'ribbonWidget',
        tagName : 'div',
        template : JST['main/ribbon'],
        connectionCount : 0,
        events : {
            'click span#capture' : 'onCapture',
            'click span#projects' : 'onProjects',
            'click span#projectID' : 'onProjectClicked'
        },
        initialize : function(){
            // hook up to the routing events
         //   Backbone.history.on('route',this.render,this);
            this.context.listen('project:selected',this.projectSelected);
            this.context.project.on('sync',this.projectChanged,this);
            this.context.project.on('destroy',this.projectDestroyed,this);
            this.context.on('status',this.statusChanged, this);
            _(this).bindAll();


            jQuery("body").everyTime(100,this.onUpdateAjaxStatus,this);
            jQuery("body").everyTime(1000,this.resetCounters,this);
/*
            // that's tricky :)
            //jQuery("body").ajaxStart( this.updateAjaxStatus );
            jQuery("body").ajaxStop( this.onAjaxStop );
            jQuery("body").ajaxComplete( this.onAjaxComplete );
            //jQuery("body").ajaxError( this.onAjaxCompleteOrError );
            jQuery("body").ajaxSend( this.onAjaxSend );
            //jQuery("body").ajaxSuccess( this.onUpdateAjaxStatus );

*/            
        },  
        onRender : function(){
            //debugger;
        },
        resetCounters : function() {
            App.cacheCollectionHit = 0;
            App.cacheItemHit = 0;
        },
        projectSelected : function( options ){
           //jQuery("span#projectID",this.el).html(options.id);
        },
        projectChanged : function(){
           jQuery("span#projectID",this.el).html(this.context.project.get('name'));
        },
        projectDestroyed : function(){
           jQuery("span#projectID",this.el).html("...");            
        },
        statusChanged : function(){
          
          var status = this.context.status.name;

          if( App.connectionsCount == 0 ){
            jQuery("span.status",this.el).html( status );
          } 
          else{
            jQuery("span.status",this.el).html( "Transfering");
          }
        },
        onCapture : function(){
            this.context.dispatchGlobally("capture:issues:list");
        },
        onProjects : function(){
            this.context.dispatchGlobally("projects:index");
        },
        onProjectClicked : function(){
            this.context.dispatchGlobally('projects:details');
        },
        onUpdateAjaxStatus : function(){
            this.statusChanged();
            
            jQuery("span#connectionCount",this.el).html(
                App.connectionsCount + "," +
                App.cacheItemHit + "," +
                App.cacheCollectionHit 
                );
        },
        onAjaxComplete : function(){
            this.connectionCount = this.connectionCount-1;
            this.onUpdateAjaxStatus();
        },
        onAjaxSend : function(){
            this.connectionCount = this.connectionCount+1;
            this.onUpdateAjaxStatus();
        },
        onAjaxStop : function(){
            this.connectionCount = 0;
            this.onUpdateAjaxStatus();
        }
    });
});