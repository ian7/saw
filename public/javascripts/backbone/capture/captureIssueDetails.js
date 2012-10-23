/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture",function(){
  this.Views.IssueDetails = Backbone.Marionette.ItemView.extend({
    template: JST['capture/captureIssueDetails'],
    tagName: "div",
    events: {
        "click  img.anchor" : "anchorClicked"
    },
    templateHelpers: {
        renderAttributeFields : function(){

        }
    },
    initialize: function() {
        _(this).bindAll();
        this.attributesView = new App.main.capture.Views.ItemAttributes({model: this.model });
    },
    onRender : function() {
        this.attributesView.el = this.attributesView.$el = jQuery("div.itemAttributes",this.el);
        this.attributesView.render();
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
    }
  });
});

