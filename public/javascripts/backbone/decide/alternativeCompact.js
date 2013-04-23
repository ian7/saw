/*global App, Backbone,_,jQuery,JST*/

App.module("main.decide",function(){
  this.Views.AlternativeCompact = Backbone.Marionette.ItemView.extend({
    template: JST['decide/alternativeCompact'],
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
      this.model.on('decisionsChanged',this.onDecisionChanged,this);
    },
    onRender : function() {
      this.nameEdit.render(jQuery("span.editable#name",this.el).first());
       if( this.model.isNew() ){
        this.focus();
        console.log("focusing");
      }   
      this.onDecisionChanged();
    },
    onDecisionChanged : function(){
      var statusEl = jQuery("span#decisionStatus",this.el);
      var h = "";

      App.main.context.decisions.each( function( decisionTag ) {
        h += decisionTag.get('name') + ": ";
        var decisionCounter = 0;
        
        this.model.decisions.each( function( decision ){
          if( decision.get('origin') === decisionTag.get('id') ){
            decisionCounter++;
          }
        },this);
        h += decisionCounter + " ";
        
      },this);

      if( this.model.isDecided() ){
        var decision = this.model.decision();
        var decisionTag = App.main.context.decisions.find( function( model ){
          return model.get('id') === decision;
        });

        h += " (Alligned: <span id='decisionName' class='"
          + decisionTag.get('color').toLowerCase()
          +"'>"  
          + decisionTag.get('name') + ")</span>";

        statusEl.html( h );
        return;
      }

      if( this.model.isColliding() ){
        h += " (Colliding)";
        statusEl.html( h );
        return;
      }

      h += " (No positions)";
      statusEl.html( h );

    },
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