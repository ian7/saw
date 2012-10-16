/*global Backbone,App,_*/

App.Models.Alternative = App.Data.Item.extend({
  initialize : function(){
    _(this).bindAll();
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
    }
});

  
App.Models.Alternatives = App.Data.Collection.extend({
  url: '',
  model : App.Models.Alternative,
  initialize : function( options ){
    if( options && options.model ){
      this.url = this.model.url
    }
  }
});



    