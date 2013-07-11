/*global Backbone,App,_*/

App.Models.Alternative = App.Data.Item.extend({

  // this is supposed to hold reference to the main context (project and decision stuff)
  context : null,
  decisions : null,
  areDecisionsUpdated : false,


  initialize : function( attributes, options ){
    _(this).bindAll();

    App.Models.Alternative.__super__.initialize.apply(this);

    this.decisions = new App.Data.SuperCollection();
    this.decisions.comparator = this.decisionComparator;
    this.decisions.on('add',this.gotDecisionsUpdate,this );
    this.decisions.on('remove',this.gotDecisionsUpdate,this );

    this.on('notify',this.notified, this);

   // this.relationsFrom.on('reset',this.gotSolvedByRelations,this);

    this.solvedByRelations = new App.Data.FilteredCollection(null,{
      collection: this.getRelationsFrom(),
      filter: function( relation ){
        return( relation.get('relation') === "SolvedBy");
        }
    });
   
    this.solvedByRelations.on('add',this.onSBadded,this);
    this.solvedByRelations.on('remove',this.onSBremoved,this);
   
    _(this.solvedByRelations.models).each( function( SBRelation ){
      this.onSBadded( SBRelation );
    },this);

    if( options && options.project ){
      this.project = options.project;
    }
    else{
      this.project = App.main.context.project;
    }

    this.projectDecisions = new App.Data.FilteredCollection(null,{
      model: App.Models.Decision,
      collection: this.decisions,
      filter : function( decision ){
        var found = _(decision.projects.models).find( function( project ){
          return( project.get('id') === this.filterParams.project.get('id') );
        },this);
        return found;
      },
      filterParams : { project: this.project }
    });


    this.activeDecisions = new App.Data.FilteredCollection(null,{
      model: App.Models.Decision,
      collection: this.projectDecisions,
      filter: function( decision ){
          return( !decision.get('revoked') );
      }
    });


    this.projectDecisions.on('add',this.gotDecisionsUpdate,this);
    this.projectDecisions.on('remove',this.gotDecisionsUpdate,this);
   },
   create : function(){
    this.unset('id');
    this.set('type','Alternative');
    this.save();
   },
   onSBadded : function( relation ){
      var subDecisions = new App.Data.FilteredCollection(null,{
        collection: relation.getRelationsTo(),
        model: App.Models.Decision,
        filter: function( relation ){ 
            return( relation.get('relation') === 'Tagging'); 
        }
      });
      subDecisions.sbRelation = relation;
      this.decisions.addCollection( subDecisions );
   },
   onSBremoved : function( relation ){
      var collection = _(this.decisions.collections).find( function( collection ){
        return( collection.sbRelation === relation );
      },this);

      this.decisions.removeCollection( collection );
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
    // this is to be passed as filter to the SuperCollection so that it can fish-out decision taggings from others

    gotDecisionsUpdate : function(){
      this.trigger('decisionsChanged',this );
    },
    isDecided : function( options ) {
    
      var projectDecisions = this.activeDecisions.models;
            
      if( projectDecisions.length === 0){
        return false;
      }

      // if there are decisions and they're not colliding, then we're decided
      if( this.isColliding( options ) ){
        return false;
      }
      else{
        return true;
      }
    },
    
    isColliding : function( options ) {
    
      var projectDecisions = this.activeDecisions.models;

      // if there are no decisions then it is not decided
      if( projectDecisions.length === 0){
        return false;
      }

      // if we have some decisions then they should point to some decision tag
      var firstDecisionID = projectDecisions[0].get('origin');

      // this basically checks if given alternative has decisions spread over various decisions
      var colliding = false;
      
      // hack hack
      _(projectDecisions).each( function( decisionTagging ) {
        if( decisionTagging.get('origin') !== firstDecisionID ){
          colliding = true;
        }
      },this);
      
      if( colliding ){
        return true;
      }
      else{
        return false;
      }

    },   
    decision : function() {

      // if given alternative is not decided upon, then give up
      if( !this.isDecided() ){
        return null;
      }

      var projectDecisions = this.activeDecisions.models;

      // otherwise just take first decision pointer and return the ID
      return projectDecisions[0].get('origin');
      
    }
});

  
App.Models.Alternatives = App.Data.Collection.extend({
  url: '',
  model : App.Models.Alternative,
  initialize : function( models ){
    _(this).bindAll();

  },
  setIssue : function( issue ){
      this.url = issue.url() + "/related_to/Alternative";
  }
});



    