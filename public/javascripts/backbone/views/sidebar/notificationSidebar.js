

App.Views.UpdateNotification = Backbone.Marionette.ItemView.extend({
  template: '#UpdateNotificationTemplate',
  tagName: 'tr',
  className: 'UpdateNotificationTemplate',
  templateHelpers: {
    get : function( id ){
        if( this[id] ){
            return(this[id]);
        }
        else{
            return("(empty)");
        }
    },
    translateUser : function(){
      return this.get('user').match(/^[A-Za-z0-9_]+/);
    },
    translateAction : function() {
      switch( this.get('event') ){
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
          return this.get('event');
          break;
      }
  },

  initialize : function(){
		_(this).bindAll();
	},

  /*
	render : function(){
    e = "";

    e += "<span class='username' title='Full username: " + this.model.get('user') + "'>";
    e += this.translateUser() + "</span> "; 

    e += "<span class='action' title='Full action-name" + this.model.get('event') + "'>";
    e += this.translateAction() + "</span> ";

    e += "<span class='id' title='Item ID: " + this.model.get('id') + "'>" ;
    e += this.model.get('type') + "</span> ";
		this.el.innerHTML = e; 


                        this.model.get('id') + "<br/>" 
                      + this.model.get('event') + "<br/>" 
                      + this.model.get('user') + "<br/>"
                      + this.model.get('type') + "<br/>"
                      + this.model.get('distance') + "<br/>"
                      + this.model.get('class');
    return( this );
	},
*/
  },
});

App.Views.NotificationSidebar = Backbone.Marionette.CompositeView.extend({
  template: '#NotificationSidebarTemplate',
  itemView: App.Views.UpdateNotification,
  className: 'NotificationSidebar',
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
    this.el.innerHTML = "<table><tbody/></table>";
		this.collectionView.el = jQuery('tbody', this.el);
		this.collectionView.render();
  },
  */
  appendHtml : function( collectionView, itemView, index ){
    jQuery("table.NotificationSidebar",collectionView.el).prepend(itemView.el);
  },
  notifyEvent : function( data ) {
    e = JSON.parse(data)
    if( this.filter(e) ) {
      e.itemId = e.id;
      
      // use id+timestamp as id because id's are not unique and this messes up backbone collection
      e.id = e.id+(new Date().getTime()).toString();

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