/*global App, Backbone,_,jQuery,JST*/


App.module("main.decide",function(that,App,Backbone,Marionette,jQuery,_,customArgs){

  this.Views.IssueList = Backbone.Marionette.CompositeView.extend({
      template: JST['decide/issueList'],
      itemViewContainer: 'div.issueList',
      events : {
          "click div#newIssueButton" : "newItem",
          "click image.anchor" : "copyAnchor",
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
      "Import Project" : {
          color: "orange",
          event: "capture:project:import",
          shortcut: "ctrl+e"
        },
      "Export Project" : {
          color: "orange",
          event: "capture:project:export",
          shortcut: "ctrl+e"
        },
      "Delete Project" : {
          color: "red",
          event: "capture:project:delete",
          shortcut: "ctrl+d"
        },
      "Report (Tabular)" : {
          color: "orange",
          event: "capture:project:reportTabular",
          shortcut: "ctrl+t"
      },
       "Report (Bullets)" : {
          color: "orange",
          event: "capture:project:reportBullets",
          shortcut: "ctrl+b"
      },
      "Reuse Issue" : {
          color: "orange",
          event: "capture:issues:reuse",
          shortcut: "ctrl+r"
        }
      },
    initialize : function() {
      this.itemView = App.main.decide.Views.IssueListItem;
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

      // let's set the url for project upload...
      jQuery("input#fileupload",this.el)
        .attr('data-url','/projects/' +
            this.context.parentContext.project.get('id') +
            '/import');

      jQuery('#fileupload',this.el).fileupload({
      dataType: 'text',
      multipart: false,
      type: 'put',
      done: function (e, data) {
          // we just display what server returned 
          alert(data.result);
      },
      fail: function( e, data ){
          alert( 'Project import failed.');
      }
      });
      //debugger;
    },
  });
});