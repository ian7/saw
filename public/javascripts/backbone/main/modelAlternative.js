/*global Backbone,App,_*/

App.Models.Alternative = App.Data.Item.extend({

  decisions : new App.Data.SuperCollection(),

  initialize : function(){
    _(this).bindAll();

    App.Models.Alternative.__super__.initialize.apply(this);
    this.set('type', "Alternative");

    // in case id is empty...
    if( !this.get('id') && this.get("_id")) {
      this.set('id',this.get('_id'));
    }
  },
    url : function() {
        if( this.id ) {
            return '/r/' + this.id;
        }
        else {
            return '/r';
        }
    },
    updateDecisions : function( issue, project ){
      this.getRelationsFrom("SolvedBy");
      this.relationsFrom.on('reset',this.gotSolvedByRelations,this);
    },
    gotSolvedByRelations : function(){
      this.decisions.reset();
      _(this.relationsFrom.models).each( function( model ){
        model.getRelationsTo("Tagging");
        //model.relationsTo.on('reset',this.gotDecisions,this);
        this.decisions.addCollection( model.relationsTo );
      },this);
    },
    gotDecisions : function( options ){
      this.decisions.add( options );
      debugger;

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



    