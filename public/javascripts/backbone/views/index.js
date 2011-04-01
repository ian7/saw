/**
 * @author Marcin Nowak
 */

App.Views.Index = Backbone.View.extend({
    initialize: function() {
        this.items = this.options.items;
        this.render();
    },
    
    render: function() {
        if(this.items.length > 0) {
            var out = "<h3><a href='#new'>Create New</a></h3><ul>";
            _(this.items).each(function(item) {
                out += "<li><a href='/items/" + item.escape('_id') + "'>" + item.escape('name') + "</a></li>";
            });
            out += "</ul>";
        } else {
            out = "<h3>No documents! <a href='#new'>Create one</a></h3>";
        }
        jQuery(this.el).html(out);
        jQuery('#app').html(this.el);
    }
});