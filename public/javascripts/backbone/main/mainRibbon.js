/*global App,Backbone,JST,_,jQuery */
 
App.module('main',function(){
    this.Views.Ribbon = Backbone.Marionette.ItemView.extend({
        className : 'ribbonWidget',
        tagName : 'div',
        template : JST['main/mainRibbon'],
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
        }
    });
});