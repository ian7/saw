/*global Backbone,App,_*/

App.Models.Issue = App.Data.Item.extend({
  initialize : function(){
    _(this).bindAll();
    
    this.set('type', "Issue");
    this.on( 'change', this.updateAlternatives, this );

    this.alternatives = new App.Models.Alternatives();
    //this.alternatives.setIssue( this );
    this.updateAlternatives();
    //this.fetch();
  },
    url : function() {
        if( this.id ) {
            return '/r/' + this.id;
        }
        else {
            return '/r';
        }
    },
    getAlternatives : function(){
      return _.where( this.get('related_to'), {type:'Alternative'} );
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



    