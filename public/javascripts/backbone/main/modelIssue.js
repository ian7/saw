/*global Backbone,App,_*/

App.Models.Issue = App.Data.Item.extend({
  
  alternatives : null,

  initialize : function(){
    _(this).bindAll();

    // calling prototype constructor
    App.Models.Issue.__super__.initialize.apply(this);
    
    this.set('type', "Issue");
    this.on( 'change', this.updateAlternatives, this );

    // this needs to be instantiated late because of the late-loading issues. 
    this.alternatives = new App.Models.Alternatives();

    // alternatives don't need to be fetched during the object creation
    // we can afford loading them later - for example from the view initializer
    //this.updateAlternatives();
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
        }
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



    