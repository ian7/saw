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
            //App.Controllers.Tags.__super__.trigger('list('+this.item.id+')');
            
        } else {
            out = "<h3>No document! <a href='#new'>Create one</a></h3>";
        }
        jQuery(this.el).html(out);
        jQuery('#app').html(this.el);
    }
});


var knowledgeItemAttribute = _.template("<li> Name: <%= name %>");
