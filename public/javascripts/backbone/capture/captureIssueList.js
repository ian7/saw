/*global App, Backbone,_,jQuery,JST*/

/*

    this, 
      this.config.app, 
      Backbone, 
      Marionette, 
      $, _, 
      this.config.customArgs
*/


App.module("main.capture",function(that,App,Backbone,Marionette,jQuery,_,customArgs){

  this.Views.IssueList = Backbone.Marionette.CollectionView.extend({
      template: JST['capture/captureIssueList'],
      itemViewContainer: 'div.issueList',
      events : {
/*          "click .newItem" : "newItem",
          "click .expandAll" : "expandAll",
          "click .collapseAll" : "collapseAll",
          "click .elicit" : "elicit"*/
      },

    initialize : function() {
      this.itemView = App.main.capture.Views.IssueListItem;

      _(this).bindAll();
    },   
    newItem : function() {
/*          collection = null;

          if( this.collection ) {
              // we're called from the render method
              collection = this.collection; 
          }
          else {
              // we're called because collection element has been saved 
              collection = this;          
          }

          
          i = new Item;

          // this.newItemName is unavailable when called by the 'save' event from the collection
          i.set({name: '(edit to add)' });
          collection.add( i );
  */        
    },
    notify : function( broadcasted_id ) {
    },
    notifyEvent : function( data ) {
          var d = JSON.parse(data);
          if( d.id === this.projectid ){
              if( d.event.match('mouse') === null ) {
                  this.collection.fetch();
              }
          }
    },
    expandAll : function() {
      _.each(this._itemsCollectionView._childViews, function( childView ) {
          childView.expand();
      });
    },
    collapseAll : function() {
      _.each(this._itemsCollectionView._childViews, function( childView ) {
          childView.collapse();
      });
    },
    shortcut : function() {
      // alert("!");
    },
    checkNewItem : function() {
          this.removeNewItem();
          this.newItem();
    },   
    onRender : function() {
      //debugger;
    }
  });
});