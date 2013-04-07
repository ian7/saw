/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture",function(){
  this.Views.IssueListItem = Backbone.Marionette.CompositeView.extend({
    itemViewContainer : "table.alternativeList tbody",
    itemView : App.main.capture.Views.AlternativeCompact,
    template: JST['capture/issueListItem'],
    templateHelpers: {
      },
    events : {
      "click .expand" : "toggleExpand",
      "click div.issueCompactView" : "doExpand",
      "click .deleteIssue" : "deleteItem",
      "click .removeIssue" : "removeItem",
      "click .details" : "navigateToDetails",
      "mouseover" : "mouseOver",
      "mouseout" : "mouseOut",
      "click div.addAlternativeButton" : "newAlternative"
    },
    shortcuts : {
      "ctrl+l" : "newAlternative"
    },
    alternativesCollection : null,
    focusedUsers : {},
    initialize : function(options) {
      _(this).bindAll();
      
      _.extend(this, new Backbone.Shortcuts() );
      this.delegateShortcuts();

      this.isExpanded = false;


      this.collection = this.model.alternatives;
      // in order to get alternatives collection, one needs to stimulate issue to fetch it :)
      this.itemViewOptions = {context: this.context};    
      this.model.updateAlternatives();

      this.nameEdit = new App.main.capture.Views.RichEdit({
          model: this.model, 
          attribute: "name"
        });

      this.searchEdit = new App.main.capture.Views.SearchEdit();
      this.searchEdit.on('selected', this.relateWithAlternative,this );
      this.searchEdit.on('entered', this.createNewAlternative,this );

      this.on('composite:rendered',this.onCompositeRendered,this);
    },
    onCompositeRendered : function() {

      // let's render editor for the name of the issue
      this.nameEdit.render(jQuery("span.editable",this.el).first());

      // and search/edit box to elicit and create new alternatives 
      this.searchEdit.render( jQuery("div#searchEdit",this.el));

      if( this.model.isNew() ){
        this.focus();
        console.log("focusing");
      }
    },
    relateWithAlternative : function( alternative ){
      
      this.model.relate( {relation: "SolvedBy", item: alternative.item.id });
    },
    createNewAlternative : function( alternativeName ){
      this.context.dispatch("capture:alternatives:create", 
        {
          model: this.model,
          alternative: {
           name : alternativeName
          }
        });
    },
    focus: function(){
      jQuery(this.el).oneTime(100,'some_focus',function(){jQuery("div.editable#name").last().focus();});
    },
    newAlternative : function(){
      if( this.isFocused ){
        //this.model.alternatives.create();
        this.context.dispatch("capture:alternatives:create",{model: this.model} );
      }
    },
    selectAll : function( e ){ 
      //if( e.toElement.innerText == '(edit to add)') {
          //e.target.execCommand('selectAll',false,null);
      //}
      if( e.target.innerText === "(empty)" ){
          e.target.innerText = "";
      }
      
    },
    editedItem : function( e ) {
          // nasty but works.

          if (e.keyCode === 13) {
              var wasNew = this.model.isNew();
              var newValue = e.srcElement.innerText;

              if(newValue === "<br>") {
                  newValue = '(empty)';
              }
              this.model.save(
                  { name: newValue },
                  { success : function( model, resp)  {

                      // make it expand on refresh                    
                      if( wasNew ) {
                          localStorage.setItem( model.get('id')+'expanded','true');
                      }
                      model.parse( resp );
                      model.change();
                  }
              });         
          }
    },
    deleteItem : function() {    
      if( confirm("Are you sure that you want to delete design issue named:\n"+this.model.get('name') ) ) {

        if( this.model.collection ) {
          // remove it from the collection first
          this.model.collection.remove( this.model );
        }
          // and then destroy it.
        this.model.destroy();
      }
    },
    removeItem : function() {
      if( confirm("Are you sure that you want to remove from the project, the design issue named:\n"+this.model.get('name') ) ) {
          var issueProjectRelation = App.main.context.project.relationsFrom.find( function( relation ){
            return( relation.get('tip') === this.model.get('id') ); 
          },this);

          if( issueProjectRelation ){ 
            issueProjectRelation.destroy();
          }
      }
    },
    doExpand : function() {
          if( this.isExpanded === false) {
              this.expand();
          }
    },
    doCollapse : function() {
          if( this.isExpanded === true) {
              this.collapse();
          }
    },
    toggleExpand: function(){
          if( this.isExpanded === false) {
              this.expand();
          }
          else {
              this.collapse();
          }
    },
    expand: function(){
              localStorage.setItem( this.model.get('id')+'expanded','true');

    },
    collapse: function(){
          localStorage.removeItem( this.model.get('id')+'expanded');

          this.isExpanded = false;
          jQuery("table.alternativeList", this.el).slideUp(300);
          jQuery(".expand", this.el).html("Expand");  
    },
    navigateToDetails : function () {
        this.context.dispatch("issue:selected",{id:this.model.id});
        this.context.dispatch("capture:issues:details");
    },

    notifyEvent : function( data ){
      //alert('here!');
      var d = JSON.parse(data);


    /*
      if( d.id === this.model.get('id') ){
          if( d.event.match('mouse') === null ) {
              this.alternativesCollection.fetch();
          }
      }
    */

      /*if( d.id === this.model.get('id') ){
          if( d.event === "mouseover") {
              jQuery(this.el).addClass("focused");
              this.focusedUsers[d.user] = (new Date()).getTime();
          }
          if( d.event === "mouseout" ) {
              jQuery(this.el).removeClass("focused");
              if( this.focusedUsers[d.user] ){
                  delete this.focusedUsers[d.user];
              }
          }
          var fuEl = jQuery("span.focusedUsers",this.el)[0];
          //fuEl.innerText = Object.keys(this.focusedUsers).length
          fuEl.innerHTML = "<br/>";
          _(this.focusedUsers).each(function(v,e){
              jQuery(fuEl).append("<img src='/images/icons/user.png' alt='"+e+"'><br/>");
          },this);
          
      }*/
    },
      mouseOver : function( e ){
        this.isFocused = true;
        jQuery("div.issueCompactView",this.el).addClass("focused");
          if( this.model.get('id') === null ) {
              return;
          }
          /*
          var notifyCode = "jQuery.getJSON('/notify/" + this.model.get('id') + "/mouseover', function(data) {})";
          if( this.mouse_timer ){
              clearTimeout( this.mouse_timer );
          }
          this.mouse_timer = setTimeout(notifyCode,900); 
          */
      },
      mouseOut : function( e ){
        this.isFocused = false;
        jQuery("div.issueCompactView",this.el).removeClass("focused");
          if( this.model.get('id') === null ) {
              return;
          }
          
          /*var notifyCode = "jQuery.getJSON('/notify/" + this.model.get('id') + "/mouseout', function(data) {})";
          if( this.mouse_timer ){
              clearTimeout( this.mouse_timer );
          }
          this.mouse_timer = setTimeout(notifyCode,500); 
          */
      }
  });
});