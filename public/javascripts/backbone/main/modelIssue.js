/*global Backbone,App*/

App.Models.Issue = App.Data.Item.extend({
  initialize : function(){
    this.set('type', "Issue");
  },
    url : function() {
        if( this.id ) {
            return '/r/' + this.id;
        }
        else {
            return '/r';
        }
    }
});

  
App.Models.Issues = App.Data.Collection.extend({
  url: '/items',
  model : App.Models.Issue,
  setProjectURL : function( projectId ){
        this.url = "/projects/"+projectId+"/items";    
  }
});



    