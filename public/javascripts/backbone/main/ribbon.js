/*global App,Backbone,JST,_,jQuery */

 
App.module('main',function(){
    this.Views.Ribbon = Backbone.Marionette.ItemView.extend({
        className : 'ribbonWidget',
        tagName : 'div',
        template : JST['main/ribbon'],
        events : {
            'click span#capture' : 'onCapture',
            'click span#projects' : 'onProjects'
        },
        initialize : function(){
            // hook up to the routing events
         //   Backbone.history.on('route',this.render,this);
            this.context.listen('project:selected',this.projectSelected);
            this.context.project.on('sync',this.projectChanged,this);
            this.context.on('status',this.statusChanged, this);
            _(this).bindAll();

            // that's tricky :)
            jQuery("body").ajaxStart( this.updateAjaxStatus );
            jQuery("body").ajaxStop( this.updateAjaxStatus );
            jQuery("body").ajaxComplete( this.onUpdateAjaxStatus );
            jQuery("body").ajaxError( this.onUpdateAjaxStatus );
            jQuery("body").ajaxSend( this.onUpdateAjaxStatus );
            jQuery("body").ajaxSuccess( this.onUpdateAjaxStatus );
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
        onUpdateAjaxStatus : function(){
            jQuery("span#connectionCount",this.el).html(jQuery.active);
        }
    });
});