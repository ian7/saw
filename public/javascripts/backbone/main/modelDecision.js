/*global Backbone,App,_*/

App.Models.Decision = App.Data.Relation.extend({

  initialize : function(){
    _(this).bindAll();

    // execute initializer of the class from above. 
    App.Models.Decision.__super__.initialize.apply(this);

    this.projects = new App.Data.RelatedCollection(null,{
      item: this,
      direction: 'to',
      filter: function( item ){
        return true;
      }
    });
    this.projects.on('add',this.onProjectsChanged,this);
    this.projects.on('remove',this.onProjectsChanged,this);
  },
  findDecisionName : function( context ){
    var name = "unknown";
    _(context.decisions.models).each( function( decision ){
      if( decision.get('id') === this.get('origin')){
        name = decision.get('name');
      }
    },this);
    
    return name;
  },
  onProjectsChanged : function(){
    this.trigger('change',this);
  }
});

App.Models.Decisions = App.Data.Relations.extend({
  model: App.Models.Decision
});