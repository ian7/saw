/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture",function(){
  this.Views.AlternativeCompact = Backbone.Marionette.ItemView.extend({
    template: JST['capture/captureAlternativeCompact'],
    tagName: 'tr',
    events : {
    },
    initialize : function(options) {
      _(this).bindAll();
            
      this.nameEdit = new App.main.capture.Views.RichEdit({
          model: this.model, 
          attribute: "name"
        });
      this.model.updateDecisions();
    },
    onRender : function() {
      this.nameEdit.render(jQuery("span.editable#name",this.el).first());
       if( this.model.isNew() ){
        this.focus();
        console.log("focusing");
      }   },
    focus: function(){
      try{
          jQuery(this.el).oneTime(100,'some_focus',this.doFocus);
      }
      catch( e ){
          console.log( "AlternaitveCompact crashed on focusing");
      }
    },
    doFocus : function(){
          jQuery("div.editable#name",this.el).focus();
    },
    selectAll : function( e ){ 
      //if( e.toElement.innerText == '(edit to add)') {
          //e.target.execCommand('selectAll',false,null);
      //}
      if( e.target.innerText === "(empty)" ){
          e.target.innerText = "";
      }
      
    }
  });
});