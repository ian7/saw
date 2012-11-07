/*global Backbone,App,_*/

App.Models.Issue = App.Data.Item.extend({
  
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
            notification.event === "unrelate") {

            this.updateAlternatives();
        }
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



    