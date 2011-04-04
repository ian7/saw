/**
 * @author Marcin Nowak
 */
 

App.Views.Tags.Add = Backbone.View.extend({
    initialize: function() {
        this.tags = this.options.tags;
        this.render();
    },
    
    render: function() {
    	var out =""
        if(this.tags.length > 0) {
        	out = JST.tags_add({tags: this.tags });
        } else {
            out = "<h3>No documents! <a href='#new'>Create one</a></h3>";
        }
        jQuery(this.el).html(out);
        //jQuery('#app').html(this.el);
    }
});

