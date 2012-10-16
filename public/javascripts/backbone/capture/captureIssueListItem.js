/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture",function(){
  this.Views.IssueListItem = Backbone.Marionette.CompositeView.extend({
    itemViewContainer : "table.alternativeList",
    itemView : App.main.capture.Views.AlternativeCompact,
    template: JST['capture/captureIssueListItem'],
    templateHelpers: {
      },
    events : {
      "click .expand" : "toggleExpand",
      "click div.issueCompactView" : "doExpand",
      "click .deleteItem" : "deleteItem",
      "click .details" : "navigateToDetails"
    },
    alternativesCollection : null,
    focusedUsers : {},
    initialize : function(options) {
      _(this).bindAll();
      
      //this.model.bind('change', this.render);
      this.isExpanded = false;
      this.id = this.model.get('id');
      this.model.view = this;
      
      this.collection = this.model.alternatives;

      this.nameEdit = new App.main.capture.Views.RichEdit({
          model: this.model, 
          attribute: "name"
        });
    },
    onRender : function() {
      this.nameEdit.render(jQuery("span.editable",this.el));
      if( this.model.isNew() ){
        this.focus();
        console.log("focusing");
      }
    },
    focus: function(){
      jQuery(this.el).oneTime(600,'some_focus',function(){jQuery("div.editable#name").last().focus()});
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
      else {
        alert( 'not in the collection - fucker: ' + this.model.get('name') );
        }
        // and then destroy it.
        this.model.destroy();
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
          // this is totally old
          //window.location.href = window.location.href+"#/"+this.model.get('id')+'/alternatives';
          // this is too simple
          //window.location.hash = "issues/"+this.model.get('id');
          
          // that's new

          // dirty way of finding the project id
          var projectId = jQuery(this.el).parents("div.projectDetailsWidget").attr('id');
          var issueId = this.model.get('id');

          window.location.hash = 'projects/'+ projectId + '/issues/' + issueId + '/alternatives';

    },
    notify : function( broadcasted_id ) {

    },
    notifyEvent : function( data ){
      //alert('here!');
      var d = JSON.parse(data);

      if( d.id === this.model.get('id') ){
          if( d.event.match('mouse') === null ) {
              this.alternativesCollection.fetch();
          }
      }


      if( d.id === this.model.get('id') ){
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
      }
    },
      mouseover : function( e ){
          if( this.model.get('id') === null ) {
              return;
          }
          var notifyCode = "jQuery.getJSON('/notify/" + this.model.get('id') + "/mouseover', function(data) {})";
          if( this.mouse_timer ){
              clearTimeout( this.mouse_timer );
          }
          this.mouse_timer = setTimeout(notifyCode,900); 
      },
      mouseout : function( e ){
          if( this.model.get('id') === null ) {
              return;
          }
          var notifyCode = "jQuery.getJSON('/notify/" + this.model.get('id') + "/mouseout', function(data) {})";
          if( this.mouse_timer ){
              clearTimeout( this.mouse_timer );
          }
          this.mouse_timer = setTimeout(notifyCode,500); 
      }
  });
});