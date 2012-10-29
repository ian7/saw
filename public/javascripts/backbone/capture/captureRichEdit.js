/*global App, Backbone,_,jQuery,JST,nicEditor*/

App.module("main.capture",function(){
  this.Views.RichEdit = Backbone.View.extend({
    events: {
        "focus div.editable" : "focused",
        "blur div.editable" : "blured",
        "keyup div.editable" : "keyup"
    },
    attribute : "",
    isFocused : null,
    initialize : function(options){
        _(this).bindAll();
        this.attribute = options.attribute;
        this.ne = new nicEditor({iconsPath : '/images/nicEditorIcons.gif', buttonList : ['bold','italic','underline','strikeThrough','ol','ul','link','unlink'],hasPanel:true});
        
        this.model.on("change:"+this.attribute,this.refresh);
        this.throttledSave =  _.throttle(this.simpleSave, 500);
    },
    render : function( element ){
        this.el = this.$el = element;
        var h = "<div>";
        var v = this.model.get(this.attribute);
        h += "<div class='editable' id='" +this.attribute+ "' contenteditable='true'>";
            if (v == null || v.replace(/<(?:.|\n)*?>/gm, '') == "") {
                h += "(empty)";
            }
            else {
                h += v;     
            }
            h += "</div>";
        jQuery(this.el).html(h);
        this.rendered = true;
        this.delegateEvents();
        this.isFocused = false;
    },
    refresh : function(){
        //debugger;
        if( this.isFocused ){
            // log and ignore
            console.log( "got refresh on focused element: "+this.model.get('name') + " attribute " + this.attribute);
        }
        else{
            var element = jQuery("div.editable",this.el)[0];
            if( element ) {
                element.innerHTML = this.model.get(this.attribute);
            }
            else {
                console.log('Caputre.Views.RichEdit: called refresh, without being rendered!');
            }
        }
    },
    focused: function( e ){
        //console.log("focused on " + e.target.nodeName + " " +e.target.id + " target: " + e.target.nodeName + " " + e.target.id);

        if( e.target.innerText === "(empty)" ){
            e.target.innerText = "";
        } 

        try {
            this.ne.panelInstance(e.srcElement);
        }
        catch( exception ) {
            console.log( "panel instance creation crashed with: " + exception );
        }

        var panelEl = jQuery("div.nicEdit-panelContain",jQuery(e.target).parent());

        this.model.notifyFocused(this.attribute);

        if(panelEl.length > 0) {
            panelEl.show();
        }
        this.isFocused = true;
    },
    blured : function( e ){
        //console.log("blured on: " + e.srcElement.nodeName + " " + e.srcElement.id + " target: " + e.target.nodeName + " " + e.target.id);

        //magically hide the panel
        jQuery("div.nicEdit-panelContain",jQuery(e.srcElement).parent()).hide();

        this.model.set(this.attribute,e.srcElement.innerHTML);
        //this.model.save();  

        this.model.notifyBlured(this.attribute);

        this.isFocused = false;
        },
    keyup : function(){
        this.throttledSave();
        },
    simpleSave : function(){
        var oldValue = this.model.get(this.attribute);
        var newValue = jQuery("div.editable",this.el)[0].innerHTML;

        if( oldValue != newValue ) {
            //var options = {};
            //options[this.attribute] = newValue;
            this.model.save(this.attribute,newValue);
            //this.model.save([this.attribute]);
            }        
    }
    });
});
