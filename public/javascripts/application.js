// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

jQuery(document).ready(function() {
  jQuery('.tab').hover( function() {     
    jQuery(this).animate({left: '40px'}, 'fast');
  }, function() {
    jQuery(this).delay(3000).animate({left: '15px'}, 'slow');
  });
});


jQuery(function(){
       jQuery('.slide-out-div').tabSlideOut({
           tabHandle: '.handle',                     //class of the element that will become your tab
           pathToTabImage: '/images/feedback.png', //path to the image for the tab //Optionally can be set using css
           imageHeight: '146px',                     //height of tab image           //Optionally can be set using css
           imageWidth: '40px',                       //width of tab image            //Optionally can be set using css
           tabLocation: 'right',                      //side of screen where tab lives, top, right, bottom, or left
           speed: 300,                               //speed of animation
           action: 'click',                          //options: 'click' or 'hover', action to trigger animation
           topPos: '200px',                          //position from the top/ use if tabLocation is left or right
           leftPos: '20px',                          //position from left/ use if tabLocation is bottom or top
           fixedPosition: true                      //options: true makes it stick(fixed position) on scroll
       });
	   jQuery('.submitFeedback').click( function(e){
		   var content = new Object;
		   content.url = window.location.href;
		   content.comment = jQuery('div.feedback').text();
		   content.author = jQuery('a#current_user').text();
		   jQuery.ajax('/feedbacks',{
			data: content,
			type: 'POST',
			success: function( data, whatever ){
				//alert( data );
				jQuery('div.feedback').text("")
				jQuery('a.handle').click();
			},
		   });
	   });	
   });