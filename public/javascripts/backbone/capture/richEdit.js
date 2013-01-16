/*global App, Backbone,_,jQuery,JST,nicEditor*/

App.module("main.capture",function(){
  this.Views.RichEdit = Backbone.View.extend({
    events: {
        "focus div.editable" : "focused",
        "blur div.editable" : "blured",
        "keyup div.editable" : "keyup",
        "click a"   : "onAnchorClicked"
    },
    attribute : "",
    isFocused : null,
    initialize : function(options){
        _(this).bindAll();
        this.attribute = options.attribute;
//        this.ne = new nicEditor({iconsPath : '/images/nicEditorIcons.gif', buttonList : ['bold','italic','underline','strikeThrough','ol','ul','link','unlink'],hasPanel:true});
        this.ne = new nicEditor({iconsPath : '/images/nicEditorIcons.gif', buttonList : ['bold','italic','underline','strikeThrough','ol','ul'],hasPanel:true});

        this.model.on("change:"+this.attribute,this.refresh);
        this.throttledSave =  _.throttle(this.simpleSave, 500);
    },
    render : function( element ){
        this.el = this.$el = element;
        var h = "<div>";
        var v = this.model.get(this.attribute);
        h += "<div class='editable' id='" +this.attribute+ "' contenteditable='true'>";
            // this actually can be done by this.refresh()
            // h += this.unEmpty( v );
            h += "</div>";
        jQuery(this.el).html(h);

        this.refresh();
        this.rendered = true;
        this.delegateEvents();
        this.isFocused = false;
    },
    unEmpty : function( value ){


        if( this.isEmpty( value )){
            jQuery("div.editable",this.el).addClass("italic");
            return '(empty)';
        }
        else {
            var regexpURL =  /([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\:[0-9]+)?(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)/igm;;

            newValue = value.replace( regexpURL, "<a href='$1'>$1</a>");
            return newValue;
        }
    },
    isEmpty : function( value ){
        if (value == null || value.replace(/<(?:.|\n)*?>/gm, '').replace(/\s+/g, ' ') === "") {
            return true;
        }
        else {
            return false;     
        }
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
                element.innerHTML = this.unEmpty( this.model.get(this.attribute) );
            }
            else {
                console.log('Caputre.Views.RichEdit: called refresh, without being rendered!');
            }
        }
    },
    focused: function( e ){
        //console.log("focused on " + e.target.nodeName + " " +e.target.id + " target: " + e.target.nodeName + " " + e.target.id);
        this.isFocused = true;

        var element = e.target;

        if( element.innerText === "(empty)" ){
            element.innerText = "";
        } 

        try {
            this.ne.panelInstance(element);
        }
        catch( exception ) {
            console.log( "panel instance creation crashed with: " + exception );
        }

        var panelEl = jQuery("div.nicEdit-panelContain",jQuery(element).parent()).first();

        this.model.notifyFocused(this.attribute);

        if(panelEl.length > 0) {
            panelEl.show();
        }
 
    },
    blured : function( e ){
        //console.log("blured on: " + e.srcElement.nodeName + " " + e.srcElement.id + " target: " + e.target.nodeName + " " + e.target.id);
        //
        this.isFocused = false;
        var element = e.target;

        //magically hide the panel
        jQuery("div.nicEdit-panelContain",jQuery(element).parent()).hide();



        this.model.set(this.attribute,element.innerHTML);


        //this.model.save();
        element.innerHTML = this.unEmpty( element.innerHTML );

        this.model.notifyBlured(this.attribute);

        },
    keyup : function(){
        jQuery("div.editable",this.el).removeClass("italic");

        this.throttledSave();
        },
    simpleSave : function(){
        var oldValue = this.model.get(this.attribute);
        var newValue = jQuery("div.editable",this.el)[0].innerHTML;

        //regexp to match <a tags>
        var anchorStartRegex = /<a href=.*?>/igm;
        var anchorStopRegex = /<\/a>/igm;

        // this will strip all the nonsense
        newValue = newValue.replace(anchorStartRegex,"").replace(anchorStopRegex,"");

        if( oldValue !== newValue ) {
            //var options = {};
            //options[this.attribute] = newValue;
            this.model.save(this.attribute,newValue);
            //this.model.save([this.attribute]);
            }
    },
    onAnchorClicked : function(e){
        window.open(e.target.innerText,'pop-up');
    }
    });
});
