/**
 * @author Marcin Nowak
 */
 
//require('backbone/application');

App.Views.Show = Backbone.View.extend({
    initialize: function(item) {
        this.item = this.options.item;
        this.render();
        _.extend( this, Backbone.Events );
        
        this.bind('update',function( item_id ){
        	if( App.Components.Items.tags ){
        		App.Components.Items.tags.trigger('update',item_id);
        	}
        	
        	if( App.Components.Items.alternatives ){
        		App.Components.Items.alternativess.trigger('update',item_id);
        	}
        });
    },
    
    render: function() {
    	var out = ""
    	var id = this.item.id;
    	var item_id = id;
        if(this.item) {
			out = JST.items_show({ item: this.item });
		  
	        jQuery.getJSON('/items/'+this.item.id+'/tag/tags_list', function(data) {
			    if(data) {
		          		tags = _(data).map(function(i) { return new Tag(i); });
		                App.Components.Items.tags = new App.Views.Tags.List({ el:tata, tags: tags });
		            }
		        });
		        
  	        jQuery.getJSON('/items/'+this.item.id+'/alternatives', function(data2) {
			    if(data2) {
		            	alternatives = _(data2).map(function(i) { return new Alternative(i); });
		                App.Components.Items.alternatives =  new App.Views.Alternatives.List({ el:aa, alternatives: alternatives });
		            }
		        });

                         
        } else {
            out = "<h3>No document! <a href='#new'>Create one</a></h3>";
        }
        jQuery(this.el).html(out);
                
        jQuery('#app').html(this.el);
        
       jQuery('.edit5').each( function(i){
       	  jQuery(this).attr('contenteditable','true');
       	  jQuery(this).keypress( function() {
       	  	jQuery(this).stopTime("edit5")
       	  	jQuery(this).oneTime(1000,"edit5", function() {
		         jQuery.ajax({
		         	type: 'PUT',
		         	url: '/items/'+item_id,
		         	data: jQuery(this).attr('id')+'='+jQuery(this).html()   	 
		         });       	  		
       	  	});
       	  });	               	  	
       	 });        
    }
});




