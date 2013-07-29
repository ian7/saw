/*global App, Backbone,_,jQuery,JST*/


App.module("main.navigate",function(that,App,Backbone,Marionette,jQuery,_,customArgs){

  this.Views.Item = Backbone.Marionette.CompositeView.extend({
      template: JST['navigate/item'],
      events : {
        'click i#shot' : 'onShotClick'
      },
    initialize : function() {

//      this.itemView = App.main.decide.Views.IssueListItem;
//      this.itemViewOptions = {context: this.context};
      // keyboard shortcuts handling
      this.model.on('change',this.onRender,this);
      this.model.on('change',this.onCompositeRendered,this);

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
        context: this.context,
        direction: 'from'
      });
      this.listToView = new App.main.navigate.Views.List( {
        collection: this.artifactsRelatedTo,
        context: this.context,
        direction: 'to'
      });

      this.on('composite:rendered',this.onCompositeRendered, this );

      _(this).bindAll();
    },   
    onCompositeRendered : function(){
      this.context.dispatchGlobally("history:push", this.serialize() );
    },
    onRender : function(){
      jQuery("div.itemName span#name",this.el).first().html( this.model.get('name') );
      jQuery("div.itemName span#type",this.el).first().html( this.model.get('type') );

      var attributesEl = jQuery("div#attributes",this.el);
      attributesEl.html("");
      var attributesCount = 0;

      _(this.model.getAttributes()).each( function( name ){
        var h = "";
        if( name === 'name'){
          return;
        }
        h += ("<div class='attribute'> <span class='bold'>"+name+"</span>:");
        var value = this.model.get(name);
        if( !value ){
          value = "<i>(empty)</i>";
        }
        h += "<span>"+value+"</span></div>";
        
        attributesCount++;

        attributesEl.append( h );
      },this);

      if( attributesCount === 0 ){
        attributesEl.append( "<i>(no additional attributes)</i>" );
      }

      this.listFromView.setElement( jQuery("div#from",this.el ) );
      this.listFromView.render();
      
      this.listToView.setElement( jQuery("div#to",this.el ) );
      this.listToView.render();
    },
    serialize : function(){
      var v = {
        dialog: 'main.navigate.item',
        itemId: this.model.get('id')
      };
      return v;
    },
    onShotClick : function(){
      this.context.dispatch('navigate:item:shot',this.model);
    }
  });
});