App.Views.UpdateNotification = Backbone.View.extend({
	initialize : function(){
		_(this).bindAll('render','translateUser','translateAction');
	},
	render : function(){
    e = "";

    e += "<span class='username' title='Full username: " + this.model.get('user') + "'>";
    e += this.translateUser() + "</span> "; 

    e += "<span class='action' title='Full action-name" + this.model.get('event') + "'>";
    e += this.translateAction() + "</span> ";

    e += "<span class='id' title='Item ID: " + this.model.get('id') + "'>" ;
    e += this.model.get('type') + "</span> ";
		this.el.innerHTML = e; 

/*
                        this.model.get('id') + "<br/>" 
                      + this.model.get('event') + "<br/>" 
                      + this.model.get('user') + "<br/>"
                      + this.model.get('type') + "<br/>"
                      + this.model.get('distance') + "<br/>"
                      + this.model.get('class');
*/
    return( this );
	},
  translateUser : function(){
    return this.model.get('user').match(/^[A-Za-z0-9_]+/);
  },
  translateAction : function() {
    switch( this.model.get('event') ){
      case 'dotag':
        return ' tagged ';
        break;
      case 'untag':
        return ' untagged ';
        break;
      case 'mouseover':
        return ' focused ';
        break
      case 'mouseout':
        return null;
      default:
        return null;
        break;
    }
  },
});

App.Views.ProjectSidebar = Backbone.View.extend({
  events : {
//	"click .newItem" : "newItem"
  },
  initialize : function() {
  	_(this).bindAll('render','notify','notifyEvent','filter');

  	this.collection = new Backbone.Collection();

	this.collectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : App.Views.UpdateNotification,
      childViewTagName     : 'tr'
    });
	this.render();
	//notifier.register(this);
  eventer.register(this);

  },
 
  render : function() {
		this.rendered = true;
    this.el.innerHTML = "<table><tbody/></table>";
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
    if( this.filter(e) ) {
      this.collection.add(e);
    }
  },
  filter : function ( e ){
    switch( e.event ){
      case 'mouseout':
        return false;
        break;
      default:
        return true;
        break;
    }
    return true;
  }
});