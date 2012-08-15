App.Views.EventNotification = Backbone.Marionette.ItemView.extend({
  template: '#eventNotificationTemplate',
  tagName: 'tr',
  className: 'eventNotification',
  templateHelpers: {
    renderAttributes : function(){
      var attributes = ['itemId','event','user','type','distance','class'];
      h  = "";
      for( var attributeId in attributes ){
        h+= this.renderAttr( attributes[attributeId] );
      }
      return(h);
    },
    renderAttr : function( attrName ){
      r = "<td>";
      r += this.get( attrName );
      r += "</td>";
      return r;
    },
     get: function( variable ){
            try {
                if( this[variable] ){
                    return this[variable];
                }
                else{
                    return "(empty)";
                }
            }
            catch( e ){
                return ("(undefined)");
            }

    },
  },
  initialize : function(){
     _(this).bindAll();
  },
  /*
  render : function(){
    e="";
    // see App.Views.EventLog class for list of the attributes. 
    _(App.Views.EventLog.prototype.attributes).each( function( a ){
      e+= this.renderAttr(a);
    },this);

    this.el.innerHTML = e;

    return( this );
  },
  */
});

App.Views.EventLog = Backbone.Marionette.CompositeView.extend({
  template: '#eventLogTemplate',
  itemView: App.Views.EventNotification,
  templateHelpers : {
    renderAttributes: function(){
      var attributes = ['itemId','event','user','type','distance','class'];
      h = "";
      for( var attributeId in attributes ){
        h += "<th> "+ attributes[attributeId] + "</th>";
      }
      return h;
    },
  },
  events : {
  },
  initialize : function() {
    _(this).bindAll();
  
    this.collection = new Backbone.Collection();

    eventer.register(this);
  },
/* 
  render : function() {
    this.rendered = true;
    e = "<table width='100%'><thead><tr>"
    _(this.attributes).each(function(a){
      e += "<th>" + a + "</th>";
    },this);
    e+= "</tr></thead><tbody/></table>"
    this.el.innerHTML = e
    this.collectionView.el = jQuery('tbody', this.el);
    this.collectionView.render();
  },
  */
  notifyEvent : function( data ) {
    e = JSON.parse(data)
    e.itemId = e.id;
    e.id = e.id+(new Date().getTime()).toString();

    console.log("Event_log caught id:"+e.itemId);
      this.collection.add(e);

  },
  appendHtml: function(collectionView, itemView){
    jQuery(collectionView.$("table tbody")[0]).prepend(itemView.el);
  },
});