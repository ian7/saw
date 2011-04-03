/**
 * @author Marcin Nowak
 */
 
require('backbone/application');

App.Views.Show = Backbone.View.extend({
    initialize: function(item) {
        this.item = this.options.item;
        this.render();
    },
    
    render: function() {
        if(this.item) {
            var out = "<h3><a href='#'>BACK !</a></h3><ul>";
            _(this.item.attributes).each(function(value, key) {
                out += "<li> <b>" + key + "</b> : " + value + "</li>";
            });
            out += "</ul>";
        } else {
            out = "<h3>No document! <a href='#new'>Create one</a></h3>";
        }
        jQuery(this.el).html(out);
        jQuery('#app').html(this.el);
    }
});


var knowledgeItemAttribute = _.template("<li> Name: <%= name %>");
