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
            this.context.on('status',this.statusChanged, this);
            _(this).bindAll();


            jQuery("body").everyTime(100,this.onUpdateAjaxStatus);
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
        projectSelected : function( options ){
           jQuery("span#projectID",this.el).html(options.id);
        },
        projectChanged : function(){
           jQuery("span#projectID",this.el).html(this.context.project.get('name'));
        },
        statusChanged : function(){
          jQuery("span.status",this.el).html(this.context.status.name);  
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
            jQuery("span#connectionCount",this.el).html(App.connectionsCount);
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