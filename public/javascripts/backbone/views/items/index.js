/**
 * @author Marcin Nowak
 */
 
//require('backbone/application');

App.Views.Index = Backbone.View.extend({
    initialize: function() {
        this.items = this.options.items;
        this.render();
    },
    
    render: function() {
    	var out = "";
        if(this.items.length > 0) {
      		out = JST.items_index( {items: this.items} ); 
        } else {
            out = "<h3>No documents! <a href='#new'>Create one</a></h3>";
        }
        jQuery(this.el).html(out);
        jQuery('#app').html(this.el);
    }
});

