/*global App, Backbone,_,jQuery,JST*/


App.module("main.analytics",function(that,App,Backbone,Marionette,jQuery,_,customArgs){

  this.Views.Index = Backbone.Marionette.CompositeView.extend({
      template: JST['analytics/index'],
      itemViewContainer: 'div#items',
      events : {
        'click tr#projects td#projectA div.projectName'  : 'onProjectAclicked',
        'click tr#projects td#projectB div.projectName'  : 'onProjectBclicked'
      },
    initialize : function( options ) {
      this.direction = options.direction;
      this.itemView = App.main.navigate.Views.ListItem;
      this.itemViewOptions = {
        context: this.context
      };

      this.projects = App.main.context.tags.filter( function( tag ){ return( tag.get('type')==='Project');} );


      this.projectA = new App.Data.Item();
      this.projectB = new App.Data.Item();

      this.relatedToA = new App.Data.RelatedCollection(null,{
        item: this.projectA,
        direction: 'from',
      });

      this.issuesA = new App.Data.FilteredCollection( null, {
        collection: this.relatedToA ,
        filter : function( item ){
          return( item.get('type') === 'Issue');
        }
      })


      this.relatedToB = new App.Data.RelatedCollection(null,{
        item: this.projectB,
        direction: 'from'
      });

      this.issuesB = new App.Data.FilteredCollection( null, {
        collection: this.relatedToB ,
        filter : function( item ){
          return( item.get('type') === 'Issue');
        }
      })


      _(this).bindAll();
    },   

    onRender : function(){

      _(this.projects).each( function( project ){
        var h = "<div class='projectName' id='" + project.get('id') +  "'>" + project.get('name') + "</div>";
        jQuery('tr#projects td#projectA',this.el).append( h );
        jQuery('tr#projects td#projectB',this.el).append( h );
      },this);

      this.itemsAview = new App.main.analytics.Views.List({context: this.context, collection: this.issuesA });
      this.itemsAview.setElement( jQuery( 'tr#issues td#projectA',this.el));
      this.itemsAview.render();

      this.itemsBview = new App.main.analytics.Views.List({context: this.context, collection: this.issuesB });
      this.itemsBview.setElement( jQuery( 'tr#issues td#projectB',this.el));
      this.itemsBview.render();

      this.delegateEvents();
    },
    onProjectAclicked : function( e ){
      jQuery('tr#projects td#projectA div.projectName').removeClass('red');
      jQuery( e.target ).addClass('red');
      this.projectA.set('id',e.target.id);
      this.projectA.fetch();
    },
    onProjectBclicked : function( e ){
      jQuery('tr#projects td#projectB div.projectName').removeClass('red');
      jQuery( e.target ).addClass('red');

      this.projectB.set('id',e.target.id);
      this.projectB.fetch();
    }

  });
});