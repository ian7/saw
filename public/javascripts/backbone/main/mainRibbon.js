/*global App,Backbone,JST,_ */

App.module('main',function(){
    this.Views.RibbonWidget = Backbone.Marionette.ItemView.extend({
        className : 'ribbonWidget',
        tagName : 'div',
        initialize : function(){
            // hook up to the routing events
            Backbone.history.on('route',this.render,this);
            _(this).bindAll();
        },  
        render : function(){
            h = "";
            h += "<a href='#'>Home</a>";

            try {
                if( app && app.context && app.context.project ){
                    h += " &gt; <a href='#projects/" + app.context.project.id + "'>";

                    // if there is no name defined
                    var projectName = app.context.project.get('name');
                    if( projectName == null ){
                        h += "(...)";
                        app.context.project.on('change',this.render,this);
                        //this.bindRenderChange( app.context.project );
                    }
                    else {
                        app.context.project.off('change',this.render,this);
                        h += projectName;
                    }
                    h += "</a>";
                }

                if( app && app.context && app.context.issue && app.context.project){

                    // if there is no name defined
                    var projectName = app.context.project.get('name');
                    if( projectName == null ){
                        app.context.project.on('change',this.render,this);
                    }
                    else{
                        app.context.project.off('change',this.render,this);
                    }

                    h += " &gt; <a href='#projects/" + app.context.project.id + "/issues/" + app.context.issue.id + "'>";
                    var issueName = app.context.issue.get('name');
                    if( issueName == null ){
                        h += "(...)";
                        app.context.issue.on('change',this.render,this);
                    }
                    else {
                        app.context.issue.off('change',this.render,this);
                        h += issueName;
                    }
                    h += "</a>";
                }

            }
            catch( e ){
                console.log( "ribbon crashed on project")

            }
            jQuery(this.el).html( h );
        },
    });
});