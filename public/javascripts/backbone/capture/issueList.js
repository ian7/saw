/*global App, Backbone,_,jQuery,JST*/


App.module("main.capture",function(that,App,Backbone,Marionette,jQuery,_,customArgs){

  this.Views.IssueList = Backbone.Marionette.CompositeView.extend({
      template: JST['capture/issueList'],
      itemViewContainer: 'div.issueList',
      events : {
          "click div#newIssueButton" : "newItem",
          "click image.anchor" : "copyAnchor"
     /*     "click .expandAll" : "expandAll",
          "click .collapseAll" : "collapseAll",
          "click .elicit" : "elicit" */
      },
      shortcuts : {
//        'ctrl+n': 'newItem'
      },
      speedButtons : {
        "New Issue" : {
          color: "green",
          event: "capture:issues:new",
          shortcut: "ctrl+n"
        },
      "Reuse Issue" : {
          color: "orange",
          event: "capture:issues:reuse",
          shortcut: "ctrl+r"
        },
      },
    initialize : function() {
      this.itemView = App.main.capture.Views.IssueListItem;
      this.itemViewOptions = {context: this.context};
      // keyboard shortcuts handling
      _.extend(this, new Backbone.Shortcuts() );
      this.delegateShortcuts();

      this.collection.on('add',this.onIssueAdded,this);

      _(this).bindAll();
    },   
    newItem : function() {
      this.context.dispatch("capture:issues:new");
    },
    copyAnchor : function(){
    },  
    onIssueAdded : function(){
     // this.collection.last().view.focus();
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
      jQuery( "img.spinner",this.el).hide();
      //debugger;
    }
  });
});