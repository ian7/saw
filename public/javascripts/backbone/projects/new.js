/*global App,Backbone,JST,_,jQuery */
App.module('main.projects',function(){
    this.Views.NewProject = Backbone.Marionette.ItemView.extend({
      template: JST['projects/new'],
      events: {
    //    "keyup input.searchBox": 'doFilter'
        "click a#create" :  'createProject'
      },
      initialize : function(a){
        _(this).extend( new Backbone.Shortcuts() );
        this.delegateShortcuts();
        _(this).bindAll();
        //this.mainView = a.mainView;
      },
      shortcuts : {
        "enter" : "createProject",
        "ctrl+w" : "createProject"
      },
      onRender : function(){
        //debugger
        //jQuery("input#projectName",this.el).focus();
        jQuery("body").oneTime(10,'focus', function(){ 
          jQuery("input#projectName").focus(); 
        });
      },
      createProject : function(){
        var name = jQuery( "input#projectName",this.el)[0].value;
        //debugger
        /* this ugly monster can be easily, and nicely replaced with:
        jQuery.ajax({
            type: 'POST',
            url: '/projects.json',
            data: { 'name': name },
            complete: this.refreshProjects
        });*/
        this.context.projects.create({name: name});
        this.close();
      },
      refreshProjects : function() {
        this.mainView.projects.fetch();
      }
     });
  });
