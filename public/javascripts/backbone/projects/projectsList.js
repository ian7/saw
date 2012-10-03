/*global App, Backbone,_,jQuery,JST*/

App.module("projects",function(){
    // this needs to be turned into a layout
    this.Views.ProjectList = Backbone.Marionette.ItemView.extend({
        template: JST['projects/projectsList'],
        className: "projectListWidgetTemplate",
        events: {
            'click div#newProjectButton' :  'newProject'
        },
        el: "div#layout div#trunk div#center",
        initialize : function(){
            Backbone.Marionette.Geppetto.bindContext({
                view: this,
                context: App.projects.context
                });
//            this.context.projects.on('change',this.render,this);

            //var speedButtonsSidebar = new App.Views.ProjectSpeedButtons({mainView:this});   
            //layout.speedButtonsSidebar.show( speedButtonsSidebar );
        },

        // this is executed after template is alreayd rendered
        onRender: function(){
            this.rootView = new App.projects.Views.ProjectItem({ model: this.context.projects,el: jQuery('div.projectView',this.el) });
            // render after thigs are loaded....
            this.rootView.model.on("change",function(){
                this.render();
                },this.rootView);
        },
        newProject : function(){
            jQuery("#newProjectModal").modal('show');

        }
    });



});


