/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture",function(){
  this.Views.IssueListItem = Backbone.Marionette.ItemView.extend({
      template: JST['capture/captureIssueListItem'],
      templateHelpers: {
      },
    events : {
      "click .expand" : "toggleExpand",
      "click .deleteItem" : "deleteItem",
      "keypress .e6" : "editedItem",
      //"click .e6" : "doExpand",
      "focus .e6" : "doExpand",
      "click .e6" : "selectAll",
      //"focus .e6" : "selectAll",    
      "click .details" : "navigateToDetails",
      "mouseover" : 'mouseover',
      "mouseout" : 'mouseout'
    },

    alternativesCollection : null,
    focusedUsers : {},

    initialize : function(options) {
      _(this).bindAll();
      
      this.model.bind('change', this.render);
      this.isExpanded = false;
      this.id = this.model.get('id');
      
      _(this).bindAll();
          
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
          var viewObject = this;
          jQuery(".deleteItem",this.el).fastConfirm({
             position: "left",
                questionText: "Are you sure that you want to delete this issue?",
                onProceed: function(trigger) {
                      // remove confirmation
                      jQuery(trigger).fastConfirm('close');

                      if( viewObject.model.collection ) {
                          // remove it from the collection first
                          viewObject.model.collection.remove( viewObject.model );
                      }
                      else {
                          alert( 'not in the collection - fucker: ' + viewObject.model.get('name') );
                      }
                      // and then destroy it.
                      viewObject.model.destroy();
                 },
                 onCancel: function(trigger) {
                         jQuery(trigger).fastConfirm('close');
                 }
              }); 
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


              if( !this.alternativesCollection ){
                  
                  this.alternativesCollection = new Alternatives();
                  this.alternativesCollection.issueView = this;
                  // catch alternatives resource location hack
                  this.alternativesCollection.item_url =this.model.url();
                  this.alternativesCollection.url = this.model.url() + '/alternatives';
                  
                  this.alternativesCollectionView = new App.Views.AlternativeCompactList({ collection: this.alternativesCollection, el: jQuery("table.alternativeList",this.el) });

                  // and fetch them...
                  this.alternativesCollection.fetch();
                  jQuery("table.alternativeList",this.el).html("<div class='spinner'><img src='/images/ui-anim_basic_16x16.gif'/></div>");
              }
              
              this.isExpanded = true;
              jQuery(".expand", this.el).html("Collapse");    
              jQuery("table.alternativeList",this.el).slideDown(300);

          
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