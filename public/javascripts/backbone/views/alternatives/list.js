
App.Views.Alternatives.List = Backbone.View.extend({
    initialize: function() {
        this.alternatives = this.options.alternatives;
        this.render();
    },
    
    render: function() {
    	var out =""
        if(this.alternatives.length > 0) {
        	out = JST.alternatives_list({alternatives: this.alternatives });
        } else {
            out = "<b>No alternatives!</b>";
        }
        jQuery(this.el).html(out);
        //jQuery('#app').html(this.el);
    }
});



