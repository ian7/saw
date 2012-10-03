/*global App,Backbone,JST,_,jQuery */
 
App.module('main',function(){
    this.Views.Ribbon = Backbone.Marionette.ItemView.extend({
        className : 'ribbonWidget',
        tagName : 'div',
        initialize : function(){
            // hook up to the routing events
            Backbone.history.on('route',this.render,this);
            this.context.listen('project:selected',this.projectSelected);
            this.context.project.on('change',this.projectChanged,this);
            _(this).bindAll();
        },  
        render : function(){
            var h = "";
            h += "<a href='#'>Home</a> &gt; <div id='projectID'></div>";

            jQuery(this.el).html( h );
        },
        projectSelected : function( options ){
           jQuery("div#projectID",this.el).html(options.id);
        },
        projectChanged : function(){
           jQuery("div#projectID",this.el).html(this.context.project.get('name'));
        }
    });
});