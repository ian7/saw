/*global App, Backbone,_,jQuery,JST,nicEditor*/

App.module("main.capture",function(){
  this.Views.RichEdit = Backbone.View.extend({
    events: {
        "focus div.editable" : "focused",
        "blur div.editable" : "blured",
        "keyup div.editable" : "keyup"
    },
    attribute : "",
    initialize : function(options){
        _(this).bindAll();
        this.attribute = options.attribute;
        this.ne = new nicEditor({iconsPath : '/images/nicEditorIcons.gif', buttonList : ['bold','italic','underline','strikeThrough','ol','ul','link','unlink'],hasPanel:true});
        
        this.model.on("change:"+this.attribute,this.refresh);
    },
    render : function( element ){
        this.el = this.$el = element;
        var h = "<div>";
        var v = this.model.get(this.attribute);
        h += "<div class='editable' id='" +this.attribute+ "' contenteditable='true'>";
            if (v == null || v.replace(/<(?:.|\n)*?>/gm, '') === "") {
                h += "(empty)";
            }
            else {
                h += v;     
            }
            h += "</div>";
        jQuery(this.el).html(h);
        this.rendered = true;
        this.delegateEvents();
    },
    refresh : function(){
        jQuery("div.editable",this.el).html( this.model.get('attribute') );
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

        if(panelEl.length > 0) {
            panelEl.show();
        }
    },
    blured : function( e ){
        //console.log("blured on: " + e.srcElement.nodeName + " " + e.srcElement.id + " target: " + e.target.nodeName + " " + e.target.id);

        //magically hide the panel
        jQuery("div.nicEdit-panelContain",jQuery(e.srcElement).parent()).hide();

        this.model.set(this.attribute,e.srcElement.innerHTML);
        this.model.save();  
        },
    keyup : function(e){
        this.model.set(this.attribute,e.srcElement.innerHTML);
        this.model.save();
        }
    });
});
