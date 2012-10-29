/*global Backbone,App,_*/

App.Models.Alternative = App.Data.Item.extend({

  // this is supposed to hold reference to the main context (project and decision stuff)
  context : null,
  decisions : null,
  areDecisionsUpdated : false,


  initialize : function(){
    _(this).bindAll();

    App.Models.Alternative.__super__.initialize.apply(this);
    this.set('type', "Alternative");

    this.decisions = new App.Data.SuperCollection();
    this.decisions.comparator = this.decisionComparator;

   },
   decisionComparator : function( decision ){
      var comparable = "";
      
      if( decision.project ){
         comparable += decision.project.get('name');
      }
      /*
      if( this.context ){
        }
        comparable += decision.findDecisionName( this.context );
      }
      else{
        comparable += decision.get('origin');
      }
      */
   },
    url : function() {
        if( this.id ) {
            return '/r/' + this.id;
        }
        else {
            return '/r';
        }
    },
    updateDecisions : function( context ){
      // we'll need context to get decisions, project, etc. 
      this.context = context;

      // set filter for superCollection 
      this.decisions.addFilter = this.addFilter;

      this.getRelationsFrom("SolvedBy");
      this.relationsFrom.on('reset',this.gotSolvedByRelations,this);
    },
    // this is to be passed as filter to the SuperCollection so that it can fish-out decision taggings from others
    addFilter : function( relationModel ){
     var gotIt = false;
      // here we go over all the decisions stored in the context
      _(this.context.decisions.models).each(function( decision ){
        // if decision 
        if( relationModel.get('origin') === decision.get('id') ){
          gotIt = true;
        }
      },this);
      if( gotIt ) {
          return true;
      }
      else{

         return false;
      }
    },
    gotSolvedByRelations : function(){
      this.decisions.reset();
      _(this.relationsFrom.models).each( function( model ){
        // taggings on the SolvedBy relation are decisions, so let's fetch them!

        var decisions = model.getRelationsTo("Tagging",App.Models.Decisions);
        
        this.decisions.addCollection( decisions );

      },this);
      this.areDecisionsUpdated = true;
    }
});

  
App.Models.Alternatives = App.Data.Collection.extend({
  url: '',
  model : App.Models.Alternative,
  initialize : function( options ){
    _(this).bindAll();

  },
  setIssue : function( issue ){
      this.url = issue.url() + "/related_to/Alternative";
  }
});



    