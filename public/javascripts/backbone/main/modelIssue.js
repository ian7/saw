/*global Backbone,App,_*/

App.Models.Issue = App.Data.Item.extend({
  initialize : function(){
    _(this).bindAll();
    
    this.set('type', "Issue");
    this.on( 'change', this.updateAlternatives, this );

    this.alternatives = new App.Models.Alternatives();
    this.updateAlternatives();
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



    