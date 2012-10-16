/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture",function(){
  this.Views.AlternativeCompact = Backbone.Marionette.ItemView.extend({
    template: JST['capture/captureAlternativeCompact'],
    events : {
    },
    initialize : function(options) {
      _(this).bindAll();
            
      this.nameEdit = new App.main.capture.Views.RichEdit({
          model: this.model, 
          attribute: "name"
        });
    },
    onRender : function() {
    },
    focus: function(){
      jQuery(this.el).oneTime(600,'some_focus',function(){jQuery("div.editable#name").last().focus();});
    },
    selectAll : function( e ){ 
      //if( e.toElement.innerText == '(edit to add)') {
          //e.target.execCommand('selectAll',false,null);
      //}
      if( e.target.innerText === "(empty)" ){
          e.target.innerText = "";
      }
      
    },
    mouseover : function( e ){
        if( this.model.get('id') === null ) {
            return;
        }
        var notifyCode = "jQuery.getJSON('/notify/" + this.model.get('id') + "/mouseover', function(data) {})";
        if( this.mouse_timer ){
            clearTimeout( this.mouse_timer );
        }
        this.mouse_timer = setTimeout(notifyCode,900); 
    },
    mouseout : function( e ){
        if( this.model.get('id') === null ) {
            return;
        }
        var notifyCode = "jQuery.getJSON('/notify/" + this.model.get('id') + "/mouseout', function(data) {})";
        if( this.mouse_timer ){
            clearTimeout( this.mouse_timer );
        }
        this.mouse_timer = setTimeout(notifyCode,500); 
    }
  });
});