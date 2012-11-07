/*global App, Backbone,_,jQuery,JST,nicEditor*/

App.module("main.capture",function(){
  this.Views.SearchEdit = Backbone.View.extend({
    events: {
        "keydown div.autoComplete" : "keyDown",
        "focus div.autoComplete" : "focused",
        "blur div.autoComplete" : "blured"
    },
    isFocused : null,
    initialize : function(options){
        _(this).bindAll();


        if( options && options.taggableType ){
            this.taggableType = options.taggableType;
        }  
        else{
            this.taggableType = "Alternative";
        }


        if( options && options.prompt ) {
            this.prompt = options.prompt;
        }
        else{
            this.prompt = "Type to search or add new " + this.taggableType + " ...";
        }   

    },
    render : function( element ){
        // let's catch which element should we render on...
        if( element ) {
            this.el = this.$el = element;
        }


        // render the div in question
        var h = "<div class='autoComplete italic' contenteditable='true'>"+ this.prompt +"</div>";
        jQuery(this.el).html(h);

        var acElement = jQuery( "div.autoComplete",this.el);
        var taggableType = this.taggableType;
        
        acElement.autocomplete({
                source: function( request, response ) {
                    jQuery.ajax({
                        url: "/search/"+request.term+'?type='+taggableType,
                        success: function( data ) {
                            response( jQuery.map( data, function( item ) {
                                return {
                                    label: item.name,
                                    value: item.name,
                                    id: item._id
                                };
                            }));
                        }
                    });
                },
                minLength: 2,
                select: this.foundAndSelected,
                open: function() {
                    jQuery( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
                },
                close: function() {
                    jQuery( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
                }
            })
        .data( "autocomplete" )._renderItem = function( ul, item ) {
            return jQuery( "<li>" )
                .data( "item.autocomplete", item )
                .append( "<a> <b>" + taggableType +  ":</b> " + item.label + "</a>" )
                .appendTo( ul );
        };

        // I have totally no idea why this is needed here. 
        // but without it the div is simply not contenteditable.... grrr
        acElement.attr('contenteditable','false');
        acElement.attr('contenteditable','true'); 
        jQuery( "div.autoComplete",this.el).addClass("italic");       

        this.rendered = true;
        this.delegateEvents();
        this.isFocused = false;
    },
    foundAndSelected : function( event, ui ){
          //jQuery.getJSON( '/relations/relate?tip='+jQuery(this).parents("p").attr('id')+'&origin='+ui.item.id, function(data) {});
          this.trigger('selected',ui);
          this.render();
    },
    focused : function(){
        window.setTimeout( function() {
            document.execCommand('selectAll',false,null);
        },1);
        jQuery( "div.autoComplete",this.el).removeClass("italic");
    },
    blured : function(){
        this.render();
    },
    keyDown : function( event ){
        
        // on enter nothing selected with the mouse
        if( event.keyCode === 13 ){ 
            
            // let's get what was typed
            var newItemName = jQuery("div.autoComplete",this.el)[0].innerText;
            
            // trigger an event with it
            this.trigger('entered',newItemName);

            // and re-render the stuff
            this.render();
            }
        }
    });
});