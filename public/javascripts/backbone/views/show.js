/**
 * @author Marcin Nowak
 */
 
//require('backbone/application');

App.Views.Show = Backbone.View.extend({
    initialize: function(item) {
        this.item = this.options.item;
        this.render();
    },
    
    render: function() {
    	var out = ""
        if(this.item) {
			out = JST.items_show({ item: this.item });
		  

        jQuery.getJSON('/items/'+this.item.id+'/tag/tags_list', function(data) {
	    if(data) {
            	var tags = _(data).map(function(i) { return new Tag(i); });
                new App.Views.Tags.List({ el:tata, tags: tags });
            }
        });
                         
        } else {
            out = "<h3>No document! <a href='#new'>Create one</a></h3>";
        }
        jQuery(this.el).html(out);
                
        jQuery('#app').html(this.el);
    }
});


var knowledgeItemAttribute = _.template("<li> Name: <%= name %>");
