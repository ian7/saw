/**
 * @author Marcin Nowak
 */
 
//require('backbone/application');

App.Views.Show = Backbone.View.extend({
	events: {
//		".addTag": "addTag", 
	},
    initialize: function() {
		this.tagCollection = new Tags;
        this.render();

      /* let's forget about that for a moment
  		_.extend( this, Backbone.Events );
        
        this.bind('update',function( item_id ){
        	if( App.Components.Items.tags ){
        		App.Components.Items.tags.trigger('update',item_id);
        	}
        	
        	if( App.Components.Items.alternatives ){
        		App.Components.Items.alternativess.trigger('update',item_id);
        	}
        });
*/
    },
    
    render: function() {
    	var out = ""
    	var id = this.model.id;
    	var item_id = id;
        if(this.model) {
			this.el.innerHTML = JST.items_show({ item: this.model });
			this.tags = new Tags;
			this.tags.url = this.model.get('item_url')+'/tag/tags_list';
			this.tags.view = this;
			this.tags.fetch({
				success: function(model,resp) {
				  	new App.Views.Tags.List({collection: model, el: model.view.el });
				},
			});
/*	        jQuery.getJSON('/items/'+this.model.id+'/tag/tags_list', function(data) {
			    if(data) {
		          		tags = _(data).map(function(i) { return new Tag(i); });
		                App.Components.Items.tags = new App.Views.Tags.List({ el:tata, tags: tags });
		            }
		        });
		        
  	        jQuery.getJSON('/items/'+this.model.id+'/alternatives', function(data2) {
			    if(data2) {
		            	alternatives = _(data2).map(function(i) { return new Alternative(i); });
		                App.Components.Items.alternatives =  new App.Views.Alternatives.List({ el:aa, alternatives: alternatives });
		            }
		        });
*/
                         
        } 
        //jQuery(this.el).html(out);
                
        //jQuery('#app').html(this.el);
        
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
    },
	addTag: function(){
/*		this.tagCollection.url = this.model.item_url + "/tags_list";

		new App.Views.Tags.Add({ el: tata, tags: tags });
		
		this.tagCollection.fetch({
			success: {
				;
			}
		});
		 jQuery.getJSON('/items/'+this.item_id+'/tag/list', function(data) {
	            if(data) {
	                var tags = _(data).map(function(i) { return new Tag(i); });
	                this.tags = 
	            } else {
	                new Error({ message: "Error loading tags to add." });
	            }
	    	});*/
	},
});




