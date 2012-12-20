/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
  this.Views.ItemRelateItem = Backbone.Marionette.CompositeView.extend({
    template: JST['capture/itemRelateItem'],
    className: 'minHeight padding1em',
    events: {
      'click div#item': 'onItemClick',
      'click div#toggleReuse': 'onToggleReuse',
      'click div#buttons button' : 'onRelateClicked'
    },
    initialize: function() {
      _(this).bindAll();
      this.model.relationsTo.on('reset', this.gotRelationsTo, this);

      this.context.item.relationsFrom.on('reset',this.updateStatus,this);

      this.context.on("typeSelector:selectedTag", this.onSelectedTag, this);
      this.context.on('filterWidget:filter', this.onFilterChange, this);
      this.context.on('itemRelate:relationSelected',this.onRelationSelected,this);



      this.acceptableRelations = _(this.context.parentContext.types.models).filter(function(type) {
        var found = false;

        if(!type.isA("Relation")) {
          return false;
        }

        _(type.get('scopes')).each(function(scope) {
          if( (this.context.item.get('type') === scope.domain )
              && scope.domain
              && (this.model.get('type') === scope.scope )
              ) {
            //console.log("Found s:" + scope.scope + " d:" + scope.domain);
            found = true;
          }
        }, this);

        if( !found ){
          //console.log("not found for: "+type.get('name') );
        }
        return found;
      }, this);

    },
    onRender: function() {
      // let's try to spare some selectors
      this.statusEl = jQuery("span#status", this.el);
      this.reuseButtonEl  = jQuery("div#toggleReuse", this.el);


        this.model.getRelationsTo();

        jQuery("span#typeName",this.el).html( this.model.get('type'));

        var h="";

        _(this.acceptableRelations).each(function(relation) {
          h += "<button class='btn' id='" + relation.get('name') + "'>" + relation.get('name') + "</button>";
        }, this);
        h += "";

        jQuery( "div#makeRelationButtons",this.el).html(h);

        this.updateVisibility();
        this.updateStatus();

    },
    updateStatus: function() {


      jQuery( "div#makeRelationButtons button",this.el).removeClass("btn-success");

      // we need to go throught the "relations from", but it makes no sense to go all over them
      // bcasuse it is easier to just browse relations of the main item

      this.context.item.relationsFrom.each( function( relation ){
        if( relation.get('tip') === this.model.get('id') ){
          jQuery( "div#makeRelationButtons button#"+relation.get('relation'),this.el).addClass("btn-success");
//           jQuery(this.el).hide();
        }
      },this);

    },
    onRelateClicked : function( e ){

      // nasty, but works
      var relationName = e.target.id;

      // let's find out if we're tagged already
      if( this.context.item.relationsFrom.find( function( relation ){
        return (relation.get('tip') === this.model.get('id') &&
          relation.get('relation') === relationName);
      },this) ){
        this.model.unrelate({item: this.context.item, relation: relationName});
      }
      else {

        // I would need to figure out if this way of making relations is good.
        // Right now it just works. 
        
        //this.context.item.relate({item: this.model, relation: relationName });
        this.model.relate({item: this.context.item, relation: relationName});
        }
    },
    onToggleReuse: function() {
      if(jQuery("div#toggleReuse", this.el).hasClass("gray")) {
        return;
      }

      jQuery("div#toggleReuse", this.el).removeClass('green red').addClass('gray').html('...');
      // finding this issue in the list of the project issues is decisive on whenever it belongs to the project or not
      if(this.context.issue.alternatives.get(this.model.get('id'))) {
        // if it belongs
        //this.model.untag( this.context.parentContext.project);
        this.context.issue.unrelate({
          relation: "SolvedBy",
          item: this.model
        });
      } else {
        // if it doesn't belong
        //this.model.tag( this.context.parentContext.project);
        this.context.issue.relate({
          relation: "SolvedBy",
          item: this.model
        });
      }
    },
    gotRelationsTo: function() {
      var taggingCount = this.model.relationsTo.where({
        relation: 'Tagging'
      }).length;
      jQuery("span#counts", this.el).html(taggingCount);
      this.context.dispatch("capture:item:gotTagReferences", this.model);
      this.updateVisibility();
      //this.updateStatus();
    },
    onItemClick: function(argument) {
      this.context.dispatch("itemSelector:selectedItem", this.model);
    },
    onSelectedTag: function(tagModel) {
      // go over relations and find what are we related to
      this.lastSelectedTag = tagModel;
      this.updateVisibility();
    },
    onFilterChange: function(filterText) {
      this.lastFilterText = filterText;
      this.updateVisibility();
    },
    onRelationSelected : function(relation){
      this.lastSelectedRelation = relation;
      this.updateVisibility();
    },
    updateVisibility: function() {
      var show = true;

      if( this.acceptableRelations.length === 0 ){
        show = false;
      }

      if( this.lastSelectedRelation ){
        var matches = _(this.lastSelectedRelation.attributes.scopes).where({
          scope: this.model.get('type')
        });

        jQuery( "div#makeRelationButtons button",this.el).hide();
        jQuery( "div#makeRelationButtons button#"+this.lastSelectedRelation.get('name'),this.el).show();

        if(matches.length === 0) {
          show = false;
        }        
      }
      else{
         jQuery( "div#makeRelationButtons button",this.el).show();
      }

      if(this.lastSelectedTag) {
        var matches = this.model.relationsTo.where({
          relation: 'Tagging',
          origin: this.lastSelectedTag.get('_id')
        });

        if(matches.length === 0) {
          show = false;
        }
      }

      if(this.lastFilterText) {
        if(this.model.get('name') == null || this.model.get('name') === "") {
          show = false;
        }
        if(this.model.get('name') && this.model.get('name').match(this.lastFilterText) === null) {
          show = false;
        }
      }

      if(show === true) {
        jQuery(this.el).show();
      } else {
        jQuery(this.el).hide();
      }

    }
  });
});
