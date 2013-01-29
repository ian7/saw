/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture",function(){
  this.Views.AlternativeCompact = Backbone.Marionette.ItemView.extend({
    template: JST['capture/alternativeCompact'],
    tagName: 'tr',
    events : {
      'click i#deleteAlternative' : 'onDeleteAlternaitve'
    },
    initialize : function(options) {
      _(this).bindAll();
            
      this.nameEdit = new App.main.capture.Views.RichEdit({
          model: this.model, 
          attribute: "name"
        });
      this.model.updateDecisions(this.context);
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
    },
    onDeleteAlternaitve : function(){

    if( confirm("Are you sure that you want to delete design alternaitve named:\n"+this.model.get('name') ) ) {

      if( this.model.collection ) {
        // remove it from the collection first
        this.model.collection.remove( this.model );
        }
      else {
        alert( 'not in the collection - fucker: ' + this.model.get('name') );
        }
        // and then destroy it.
        this.model.destroy();
      }
    }
  });
});