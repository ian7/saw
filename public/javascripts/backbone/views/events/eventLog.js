App.Views.EventNotification = Backbone.View.extend({
	initialize : function(){
		_(this).bindAll('render','renderAttr');
	},
	render : function(){
    e="";
    // see App.Views.EventLog class for list of the attributes. 
    _(App.Views.EventLog.prototype.attributes).each( function( a ){
      e+= this.renderAttr(a);
    },this);

    this.el.innerHTML = e;

    return( this );
	},
  renderAttr : function( attrName ){
    r = "<td>";
    r += this.model.get( attrName );
    r += "</td>";
    return r;
  },
});

App.Views.EventLog = Backbone.View.extend({
  attributes : ['id','event','user','type','distance','class'],
  events : {
//	"click .newItem" : "newItem"
  },
  initialize : function() {
  	_(this).bindAll('render','notify');

  	this.collection = new Backbone.Collection();

	this.collectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : App.Views.EventNotification,
      childViewTagName     : 'tr'
    });
	this.render();
	//notifier.register(this);
  eventer.register(this);
  },
 
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
  notify : function( broadcasted_id ) {
  	n = {};
  	n.id = broadcasted_id;
  	n.text = "tada!";
  	this.collection.add(n);
  },
  notifyEvent : function( data ) {
    e = JSON.parse(data)
    //if(e.type != null) {
      this.collection.add(e);
    //}
  },
  filter : function ( e ){
    return true;
  }
});