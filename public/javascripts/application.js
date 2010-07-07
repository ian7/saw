// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

jQuery(document).ready(function() {
  jQuery('.tab').hover( function() {     
    jQuery(this).animate({left: '40px'}, 'fast');
  }, function() {
    jQuery(this).animate({left: '15px'}, 'slow');
  });
});
