/*global App, Backbone,_,jQuery,JST,nicEditor*/

App.module("main.capture", function(that, App, Backbone, Marionette, jQuery, _, customArgs) {
    this.Views.RationaleWidget = Backbone.Marionette.ItemView.extend({
    template: JST['capture/rationaleWidget'],
    events: {
        "click a.btn#save": 'save'
    },
    initialize: function() {
        _(this).bindAll();
        this.model.on('change', this.render, this);
    },
    beforeRender: function() {
/*        if (this.model.get('your_decision').tagging_id === null) {
            this.template = "#RationaleWidgetTemplateSpinner";
        } else {
            this.template = '#RationaleWidgetTemplate';
        }*/
    },
    onRender: function() {
    var rtEl = jQuery("div#rationaleText", this.el)[0];
        if( rtEl ) {
            
            rtEl.innerHTML = this.model.get('rationale');
            
            this.ne = new nicEditor({
                iconsPath: '/images/nicEditorIcons.gif',
                buttonList: ['bold', 'italic', 'underline', 'strikeThrough', 'ol', 'ul', 'link', 'unlink'],
                hasPanel: true
            });
            this.ne.panelInstance(rtEl);

            // no idea why do I need this...
            // without it editor renders wrong....
            jQuery("div", jQuery("div#rationaleText", this.el).parent()).eq(0)[0].style.width = "100%";

            // this sets focus where it should be. 
            jQuery(this.el).oneTime(300, 'some_focus', function() {
                var el= jQuery("div#rationaleText")[0];
                if( el ){
                    el.focus();
                }
            });
        }
    },
    save: function() {
        this.model.set('rationale',jQuery("div#rationaleText", this.el).html());
        this.model.save();
        App.main.layout.modal.close();
    }
    });
});