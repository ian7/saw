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
    	var id = this.item.id;
        if(this.item) {
			out = JST.items_show({ item: this.item });
		  
	        jQuery.getJSON('/items/'+this.item.id+'/tag/tags_list', function(data) {
			    if(data) {
		            	var tags = _(data).map(function(i) { return new Tag(i); });
		                new App.Views.Tags.List({ el:tata, tags: tags });
		            }
		        });
		        
  	        jQuery.getJSON('/items/'+this.item.id+'/alternatives', function(data2) {
			    if(data2) {
		            	var alternatives = _(data2).map(function(i) { return new Alternative(i); });
		                new App.Views.Alternatives.List({ el:aa, alternatives: alternatives });
		            }
		        });

                         
        } else {
            out = "<h3>No document! <a href='#new'>Create one</a></h3>";
        }
        jQuery(this.el).html(out);
                
        jQuery('#app').html(this.el);
        
       jQuery('.edit').each( function(i){
          jQuery(this).editable('/items/'+id,{
         name     : jQuery(this).attr('id'),
         type     : 'textarea',
         width    : '100%',
         submit   : 'OK',
         method   : 'PUT',
         submitdata  : {inplace: jQuery(this).attr('id') }
        });
       });        
    }
});




