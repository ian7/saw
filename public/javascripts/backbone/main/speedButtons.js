/*global App, Backbone,_,jQuery,JST*/

App.module("main",function(){
    this.Views.SpeedButtons = Backbone.Marionette.View.extend({
      events : {
        "click  div.button" : "buttonClicked"
      },
      shortcuts : {
      },
      initialize : function(options){
        _(this).bindAll();
        
        this.speedButtons = options.speedButtons;

        // keyboard shortcuts handling
        _.extend(this, new Backbone.Shortcuts() );
      
      },

      render : function(){
        var h="";
        

        _(this.speedButtons).each(function(button,caption){
          // render funny buttons
          h += "<div class='button " + button.color + "' id='" + button.event + "'>" + caption + "</div></br>";
          
          // assign hotkeys

          // this declares anonymous function with button.event identifier stored
          this.shortcuts[button.shortcut] = function( e ){
            this.context.dispatchGlobally( button.event );
            };

        },this);

       this.delegateShortcuts();

        
        this.$el.html(h);
      },
      buttonClicked : function( e ){
        console.log("speed button clicked - emits: " + e.target.id );
        this.context.dispatchGlobally( e.target.id );
      },
      keyboradShortcutPressed : function( e ){
        debugger;
      }
    });
});


