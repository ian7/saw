/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture",function(){
  this.Views.IssueDetails = Backbone.Marionette.CompositeView.extend({
    template: JST['capture/issueDetails'],
    tagName: "div",
    itemView: App.main.capture.Views.AlternativeDetails,
    itemViewContainer: "table.alternativeListDetails tbody",
    events: {
        "click #deleteIssue"   : "deleteIssue",
        "click #sealAlternative"    : 'onSealAlternative',
        "click #tags"   : 'onTags',
        "click #requestFocus"   : 'onRequestFocus',
        "click #relate" : "onRelate",
        'click #shot' : 'onShot',
        "click #classify" : "onClassify"
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
        this.collection.on('add',this.onDecisionsChanged,this );
        this.collection.on('remove',this.onDecisionsChanged,this );

        this.itemViewOptions = {context: this.context};
        
        this.model.relationsTo.on('add',this.updateSealing,this);
        this.model.relationsTo.on('remove',this.updateSealing,this);

        this.on('composite:model:rendered',this.onItemRendered,this);
        this.model.on('change',this.pushState,this);
    },
    onShot : function(){
            this.context.dispatchGlobally('navigate:start',this.model);
    },
    pushState : function() {
        window.history.pushState("issue details", "issue details", window.location.origin 
                + "/#capture/project/" + this.context.parentContext.project.get('id')
                + "/issue/" + this.context.issue.get('id'));
    },
    onRender: function(){
    },
    onItemRendered : function() {

        jQuery("#shot",this.el).popover({
            trigger: 'hover',
            title: 'Navigate',
            content: 'Navigate starting from this issue',
            placement: 'top'
        });

         jQuery("#deleteIssue",this.el).popover({
            trigger: 'hover',
            title: 'Delete',
            content: 'Delete this Issue',
            placement: 'bottom'
        });

        jQuery("#sealAlternative",this.el).popover({
            trigger: 'hover',
            title: 'Seal',
            content: '(un)seal this Issue',
            placement: 'bottom'
        });

        jQuery("#relate",this.el).popover({
            trigger: 'hover',
            title: 'Relate',
            content: 'Change relations to and from this Issue',
            placement: 'bottom'
        });

        jQuery("#tags",this.el).popover({
            trigger: 'hover',
            title: 'Tags',
            content: 'Add and remove tags on this Issue',
            placement: 'bottom'
        });

        jQuery("#requestFocus",this.el).popover({
            trigger: 'hover',
            title: 'Focus',
            content: 'Request your team to focus on this Issue',
            placement: 'bottom'
        });


        this.attributesView.el = this.attributesView.$el = jQuery("div.itemAttributes",this.el).first();
        this.attributesView.render();
        this.model.updateAlternatives();

        this.tagListWidget = new App.main.Views.TagListWidget({context:this, collection : this.collection  });
        App.main.layout.tagSidebar.show( this.tagListWidget );  

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
    },
    deleteIssue : function(){
      if( confirm("Are you sure that you want to delete design issue named:\n"+this.model.get('name') ) ) {
        // and then destroy it.
        this.model.destroy();
        jQuery("div.popover").remove();
        this.context.dispatchGlobally("capture:issues:list");
        }
    },
    onRelate : function(){
        //this.context.item = this.model;
        this.context.dispatch("capture:item:relate",this.model);
    },
    onTags : function(){
      var widget = new App.main.Views.TaggingWidget({context:App.main.context, model: this.model });
      App.main.layout.modal.show( widget );
    },
    updateSealing : function(){
        var sealingEl = jQuery('#sealAlternative',this.el);
        if( this.model.isSealed() ){
            sealingEl.addClass('icon-lock').removeClass('icon-unlock');
        }
        else{
            sealingEl.addClass('icon-unlock').removeClass('icon-lock');
        }
    },
    onSealAlternative : function(){
        this.model.toggleSeal();
    },
    onRequestFocus : function(){
        this.model.notify('requestFocus');
    },
    onClassify : function(){
        var tagType = App.main.context.types.find( function( type ){
            return ( type.get('name') === 'Status');
        },this);
        var classifyWidget = new App.main.Views.ClassifyWidget({
            context: this.context,
            tagType: tagType,
            collection: this.model.alternatives
        });
        App.main.layout.modal.show( classifyWidget );
    },
    onClose : function(){
        App.main.layout.tagSidebar.close();
    }
  });
});

