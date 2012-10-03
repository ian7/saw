/*global App,Backbone,JST,_,jQuery */
App.module('projects',function(){
    this.Views.NewProjectWidget = Backbone.Marionette.ItemView.extend({
      template: '#NewProjectWidgetTemplate',
      events: {
    //    "keyup input.searchBox": 'doFilter'
        "click a#create" :  'createProject'
      },
      initialize : function(a){
        _(this).bindAll();
        this.mainView = a.mainView;

      },
      onRender : function(){
        //debugger
        jQuery("input#projectName",this.el).focus();
      },
      createProject : function(){
        var name = jQuery( "input#projectName",this.el)[0].value;
        //debugger
        jQuery.ajax({
            type: 'POST',
            url: '/projects.json',
            data: { 'name': name },
            complete: this.refreshProjects
        });
        layout.modal.close();
      },
      refreshProjects : function() {
        this.mainView.projects.fetch();
      }
     });
  });
