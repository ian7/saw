/*global Backbone,App,_*/

App.Models.Decision = App.Data.Relation.extend({

  initialize : function(){
    _(this).bindAll();

    // execute initializer of the class from above. 
    App.Models.Decision.__super__.initialize.apply(this);
    this.updateProject(App.main.context);
  },
  updateProject : function( context ){
    this.context = context; 

    var projects = this.getRelationsTo("Tagging");
    projects.on('reset',this.gotProjects,this);

  },
  gotProjects : function(){

    _(this.relationsTo.models).each(function( model ){
      if( model.get('origin') === this.context.project.get('id') ){
        this.project = this.context.project;
      }
    },this);
    this.trigger('gotProjects');
    this.trigger('change');
  },
  findDecisionName : function( context ){
    var name = "unknown";
    _(context.decisions.models).each( function( decision ){
      if( decision.get('id') === this.get('origin')){
        name = decision.get('name');
      }
    },this);
    
    return name;
  }
});

App.Models.Decisions = App.Data.Relations.extend({
  model: App.Models.Decision
});