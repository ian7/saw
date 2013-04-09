/*global App, Backbone,_,jQuery,JST*/

App.module("main",function(that,App,Backbone,Marionette,jQuery,_,customArgs){
  
  this.Views.FilterWidget = Backbone.Marionette.CompositeView.extend({
    template: JST['main/filterWidget'],
    className: 'minHeight padding1em',
    events : {
        'keyup input#filter' : 'onKeyUp',
        'click #clearFilter' : 'onClearFilterClick'
    },
    shortcuts : {
    },
    speedButtons : {
    },
    initialize : function() {
      _(this).bindAll();
      this.context.on('filterWidget:filter',this.onFilterSet,this);
    },
    onRender : function() {
    },
    onKeyUp : function(){
        this.context.dispatch('filterWidget:filter',jQuery('input#filter',this.el)[0].value);
    },
    onFilterSet : function( newFilter ){
        jQuery( "input#filter",this.el)[0].value = newFilter;
    },
    onClearFilterClick : function(){
        this.context.trigger('filter:clear');
    }
  });
});