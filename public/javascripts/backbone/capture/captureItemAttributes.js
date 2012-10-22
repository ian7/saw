/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture",function(){
  this.Views.ItemAttributes = Backbone.Marionette.ItemView.extend({
    initialize : function() {
        _(this).bindAll();

        this.editorObjects = {};
        this.model.on('change',this.refresh,this);

        this.numberOfRenderedAttributes = 0;
    },
    render : function(){
        var h = "<table class='itemAttributes'>";

        // first I render divs
        _(this.model.getAttributes()).each( function(attribute){
            h += "<tr><th>" + attribute + "</th>";
            h += "<td>";
            h += "<div class='editable' id='" + attribute + "'>";
            h += "</div>";
            h += "</td></tr>";
        },this);
        
        h += "</table>";
        jQuery( this.el ).html(h);


        _(this.model.getAttributes()).each( function(attribute){
            var newEditor = new App.main.capture.Views.RichEdit({
                model: this.model, 
                attribute: attribute
                });
            newEditor.render(jQuery("div.editable#"+attribute),this.el);

            this.editorObjects[attribute] = newEditor;
            },this);
           
        this.numberOfRenderedAttributes = this.model.getAttributes().length;
    },
    refresh : function(){

        // 
        if( this.numberOfRenderedAttributes === 0 ){
            this.render();
            return;
        }

    }
  });
});