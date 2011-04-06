
App.Views.Alternatives.List = Backbone.View.extend({
    initialize: function() {
        this.alternatives = this.options.alternatives;
        _.extend( this, Backbone.Events );
        this.render();
        this.bind("update", function( item_id ){
        	// do nothing
        	;
        });
    },
    
    render: function() {
    	var out =""
        if(this.alternatives.length > 0) {
        	out = JST.alternatives_list({alternatives: this.alternatives });
		   
        } else {
            out = "<b>No alternatives!</b>";
        }
        

        jQuery(this.el).html(out);



        
        
       	_(this.alternatives).each(function(a) { 

			 var j = a.attributes.id;
			 var b = a;

			
			
			// in-place editing
/*			 jQuery('.alternativeEdit'+j).each( function(i){
	          jQuery(this).editable('/items/'+j,{
	         name     : jQuery(this).attr('id'),
	         type     : 'textarea',
	         submit   : 'OK',
	         method   : 'PUT',
	         submitdata  : {inplace: jQuery(this).attr('id') }
	        });
	*/        
	        
	           jQuery('.alternativeEdit'+j).each( function(i){
		       	  jQuery(this).attr('contenteditable','true');
		       	  jQuery(this).keypress( function() {
		       	  	jQuery(this).stopTime("edit5")
		       	  	jQuery(this).oneTime(1000,"edit5", function() {
				         jQuery.ajax({
				         	type: 'PUT',
				         	url: '/items/'+jQuery(this).parent().parent().attr('id'),
				         	data: jQuery(this).attr('id')+'='+jQuery(this).html()   	 
				         });       	  		
		       	  	});
		       	  });	               	  	
		       	 });        
	             
	   });  
		   		   
        //jQuery('#app').html(this.el);
    },
    // this updates single row in the table
    update: function( item_id ){
    		
        }
});



