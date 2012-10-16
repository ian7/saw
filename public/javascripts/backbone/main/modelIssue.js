/*global Backbone,App,_*/

App.Models.Issue = App.Data.Item.extend({
  initialize : function(){
    _(this).bindAll();
    
    this.set('type', "Issue");
    this.on( 'sync', this.updateAlternatives, this );

    this.alternatives = new App.Models.Alternatives();
    //this.updateAlternatives();
    this.fetch();
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
     var  as = this.getAlternatives()
      this.alternatives.reset( as );
      debugger;
    }
});

  
App.Models.Issues = App.Data.Collection.extend({
  url: '/items',
  model : App.Models.Issue,
  setProjectURL : function( projectId ){
        this.url = "/projects/"+projectId+"/items";    
  }
});



    