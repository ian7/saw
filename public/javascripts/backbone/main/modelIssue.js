/*global Backbone,App,_*/

App.Models.Issue = App.Data.Item.extend({
  
    state: {
        noAlternatives: 'No alternatives',
        noDecisions: 'No decisions were made yet',
        missingDecisions: 'Some decisions are missing',
        notConclusive: 'Decisions are not conclusive (multiple positive)',
        openNonConclusive: 'Decisions not conclusive (open alternatives)',
        noSolution: 'There are no acceptable alternatives',
        colliding: 'Alternatives have colliding decisions',
        decided: 'Decided',
        unknown: 'That shouldn\'t happen'
    },

  alternatives : null,
  areAlternativesUpdated : false,

  initialize : function(){
    _(this).bindAll();

    // calling prototype constructor
    App.Models.Issue.__super__.initialize.apply(this);
    
    this.set('type', "Issue");
    this.on( 'change', this.updateAlternatives, this );
    this.on( 'change', this.updateRelationsTo, this );


    // this needs to be instantiated late because of the late-loading issues. 
    this.alternatives = new App.Models.Alternatives();
    this.alternatives.on('decisionsChanged',this.onDecisionsChanged );

    // alternatives don't need to be fetched during the object creation
    // we can afford loading them later - for example from the view initializer
    //this.updateAlternatives();

    // in case alternative gets related to this issue, we should updateAlternatives
    // this goes through the notification
    this.on('notify',this.notified, this);
  },
    url : function() {
        if( this.id ) {
            return '/r/' + this.id;
        }
        else {
            return '/r';
        }
    },

    updateAlternatives : function() {
        if( this.get('id') ){
            this.alternatives.setIssue( this );
            this.alternatives.fetch();
            this.areAlternativesUpdated = true;
        }
    },
    updateRelationsTo : function() {
        this.getRelationsTo();
    },
    notified : function( notification ) {
      if( notification.distance ===  1 ) {
        if( notification.event === "relate" ||
            notification.event === "unrelate" ||
            notification.event === "destroy") {

            this.updateAlternatives();
        }
      }
    },
    decisionState : function(){
        if( this.alternatives.length === 0 ){
            return this.state.noAlternatives;
        }

        var decisionsTotal = 0;
        var foundNotDecidedAlterantive = false;
        var foundCollidingAlternative = false;
        var positiveAlternatives = 0;
        var openAlternatives = 0;
        var negativeAlternatives = 0;

        var positiveDecisionTag = App.main.context.decisions.find( function( decision ){ return( decision.get('name') === 'Positive' );});
        var openDecisionTag = App.main.context.decisions.find( function( decision ){ return( decision.get('name') === 'Open' );});
        var negativeDecisionTag = App.main.context.decisions.find( function( decision ){ return( decision.get('name') === 'Negative' );});

        _(this.alternatives.models).each( function(alternative) {
            var projectDecisions = alternative.getProjectDecisions( {project: App.main.context.project } );
            decisionsTotal = decisionsTotal + projectDecisions;

            if (projectDecisions.length == 0) {
                foundNotDecidedAlterantive = true;
            }

            if (alternative.isColliding({ project: App.main.context.project })) {
                foundCollidingAlternative = true;
            }

            var decision = alternative.decision({ project: App.main.context.project });

            if (decision) {
                if (decision === positiveDecisionTag.get('id') ) {
                    positiveAlternatives = positiveAlternatives + 1;
                }
                if (decision === openDecisionTag.get('id') ) {
                    openAlternatives = openAlternatives + 1;
                }
                if (decision === negativeDecisionTag.get('id') ) {
                    negativeAlternatives = negativeAlternatives + 1;
                }
            }

        }, this);


        if (decisionsTotal == 0) {
            return this.state.noDecisions;
        }

        if (positiveAlternatives > 1) {
            return this.state.notConclusive;
        }

        if (foundNotDecidedAlterantive ) {
            return this.state.missingDecisions;
        }


        if (positiveAlternatives == 0) {
            return this.state.noSolution;
        }

        if (foundCollidingAlternative) {
            return this.state.colliding;
        }

        if (positiveAlternatives == 1) {
            if (openAlternatives > 0){
                return this.state.openNonConclusive;
            }
            else{
                return this.state.decided;
            }
        }

        // that shouldn't happen
        return this.state.unknown;
    },
    onDecisionsChanged : function( alternative ){
        this.trigger('decisionsChanged',{issue: this, alternative: alternative });
    }
});

  
App.Models.Issues = App.Data.Collection.extend({
    initialize : function(){
        _(this).bindAll();
    },
  url: '/items',
  model : App.Models.Issue,
  setProjectURL : function( projectId ){
        //this.url = "/projects/"+projectId+"/items";    
        this.url = "/r/"+projectId+"/related_from/Issue";
  }
});



    