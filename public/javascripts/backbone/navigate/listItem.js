/*global App, Backbone,_,jQuery,JST*/


App.module("main.navigate",function(that,App,Backbone,Marionette,jQuery,_,customArgs){

  this.Views.ListItem = Backbone.Marionette.CompositeView.extend({
      template: JST['navigate/listItem'],
      events : {
        'click' : 'onClick'
      },
    initialize : function() {

      this.itemView = App.main.navigate.Views.ListItem;
      this.itemViewOptions = {context: this.context};
      // keyboard shortcuts handling
      this.model.on('change',this.onChange, this);

      _(this).bindAll();
    },   
    onRender : function(){
      jQuery("div#item span#name",this.el).html( this.model.get('name') );
      jQuery("div#item span#type",this.el).first().html( this.model.get('type') );      

      if( this.model.metaData && this.model.metaData.relation ){
        // let's find the relation type
        
        var relationType = App.main.context.types.find( function( type ){
          return( type.get('name') === this.model.metaData.relation.get('relation') );
        },this); 
        
        if( relationType ){
          var name = "...";

          if( this.direction === 'to') {
            name = relationType.get('forward_name');
          }
          else {
            name = relationType.get('reverse_name');
          }
          if( !name ){
            name = relationType.get('name');
          }
          jQuery("span#relation",this.el).html(name);
        }
      }
    /*  if( this.model.get('name') && this.model.get('name') != "" ){
        this.$el.show();
      }
      else{
        this.%el.hide();
      }
      */
    },
    onChange : function(){
      this.onRender();
    },
    onClick : function(){
      this.context.trigger( 'navigate:move', this.model.get('id') );
    },
  });
});