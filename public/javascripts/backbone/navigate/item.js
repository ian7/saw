/*global App, Backbone,_,jQuery,JST*/


App.module("main.navigate",function(that,App,Backbone,Marionette,jQuery,_,customArgs){

  this.Views.Item = Backbone.Marionette.CompositeView.extend({
      template: JST['navigate/item'],
      events : {
      },
    initialize : function() {

//      this.itemView = App.main.decide.Views.IssueListItem;
//      this.itemViewOptions = {context: this.context};
      // keyboard shortcuts handling
      this.model.on('change',this.onRender,this);

      this.itemsRelatedFrom = new App.Data.RelatedCollection( null, {
        item: this.model, 
        direction: 'from'
      });
      
      this.itemsRelatedTo = new App.Data.RelatedCollection( null, {
        item: this.model, 
        direction: 'to'
      });


      this.artifactsRelatedFrom = new App.Data.FilteredCollection( null, {
        collection: this.itemsRelatedFrom,
        filter: function( item ){
          return( !item.get('relation') );
        }
      });

      this.artifactsRelatedTo = new App.Data.FilteredCollection( null, {
        collection: this.itemsRelatedTo,
        filter: function( item ){
          return( !item.get('relation') );
        }
      });

      this.listFromView = new App.main.navigate.Views.List( {
        collection: this.artifactsRelatedFrom,
        context: this.context
      });
      this.listToView = new App.main.navigate.Views.List( {
        collection: this.artifactsRelatedTo,
        context: this.context        
      });

      _(this).bindAll();
    },   
    onRender : function(){
      jQuery("td#item div#item span#name",this.el).first().html( this.model.get('name') );
      jQuery("td#item div#item span#type",this.el).first().html( this.model.get('type') );

      this.listFromView.setElement( jQuery("div#from",this.el ) );
      this.listFromView.render();
      
      this.listToView.setElement( jQuery("div#to",this.el ) );
      this.listToView.render();

    }
  });
});