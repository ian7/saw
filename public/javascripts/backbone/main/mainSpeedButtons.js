/*global App, Backbone,_,jQuery,JST*/

App.module("projects",function(){
    App.Views.ProjectSpeedButtons = Backbone.Marionette.View.extend({
      events : {
        'click div#newProject' : 'newProject'
      },
      initialize : function(a){
        _(this).bindAll();
        this.mainView = a.mainView;
        this.collection = this.mainView.collection;
      },
      render : function(){
        var h="";
        h+="<div class='button green' id='newProject'>New Project</div>";
        this.$el.html(h);
        //this.delegateEvents();
      },
      newProject : function(){
        //mainView.
        var np = new App.Views.NewProjectWidget({mainView:this.mainView});
        layout.modal.show( np );
      }
    });
});


