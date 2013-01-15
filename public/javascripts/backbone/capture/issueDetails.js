/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture",function(){
  this.Views.IssueDetails = Backbone.Marionette.CompositeView.extend({
    template: JST['capture/issueDetails'],
    tagName: "div", 
    itemView: App.main.capture.Views.AlternativeDetails,
    itemViewContainer: "table.alternativeListDetails tbody",
    events: {
        "click  img.anchor" : "anchorClicked"
    },
    templateHelpers: {
        renderAttributeFields : function(){

        }
    },
    speedButtons : {
        "New Alternative" : {
          color: "green",
          event: "capture:alternatives:create",
          shortcut: "ctrl+n"
        },
        "Reuse Alternative" : {
          color: "orange",
          event: "capture:alternatives:reuse",
          shortcut: "ctrl+r"
        },
        "Issue List" : {
          color: "orange",
          event: "capture:issues:list",
          shortcut: "ctrl+i"
        }
    },
    initialize: function() {
        _(this).bindAll();
        this.attributesView = new App.main.capture.Views.ItemAttributes({model: this.model });
        
        this.collection = this.model.alternatives;

        this.collection.on('decisionsChanged',this.onDecisionsChanged,this );

        this.itemViewOptions = {context: this.context};

        this.on('composite:model:rendered',this.onItemRendered,this);
        this.model.on('change',this.pushState,this);
    },
    pushState : function() {
        window.history.pushState("issue details", "issue details", window.location.origin 
                + "/#capture/project/" + this.context.parentContext.project.get('id')
                + "/issue/" + this.context.issue.get('id'));
    },
    onRender: function(){
        
    },
    onItemRendered : function() {
        this.attributesView.el = this.attributesView.$el = jQuery("div.itemAttributes",this.el).first();
        this.attributesView.render();
        this.model.updateAlternatives();

        },
    anchorClicked : function() {
        jQuery("img.anchor",this.el).popover({
           content: "<textarea>"+ window.location.origin 
                + "#capture/project/" + this.context.parentContext.project.get('id')
                + "/issue/" + this.context.issue.get('id')
                + "</textarea>",
            placement: 'left',
            title: 'Permanent URL:',
            trigger: 'manual'
        });
        jQuery("img.anchor",this.el).popover('show');
        jQuery("div.popover-content p textarea").focus();
        document.execCommand('selectAll',false,null);
        document.execCommand('copy',false,null);
     //   jQ
    },
    onDecisionsChanged : function(){
        jQuery('span#issueStatus',this.el).html( this.model.decisionState() );
        //console.log('now');
    }
  });
});

