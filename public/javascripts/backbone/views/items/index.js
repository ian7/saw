/**
 * @author Marcin Nowak
 */

jQuery.fn.flash = function( color, duration )
{
/*	duration = 50000;
    var current = this.css( 'color' );

    this.animate( { color: 'rgb(' + color + ')' }, duration / 2 );
    this.animate( { color: current }, duration / 2 );
*/
}

App.Views.IssueCompactView = Backbone.Marionette.ItemView.extend({
	template: '#issueCompactViewTemplate',
	templateHelpers: {
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
  events : {
	"click .expand" : "toggleExpand",
	"click .deleteItem" : "deleteItem",
	"keypress .e6" : "editedItem",
	"click .e6" : "expand",
	"click .e6" : "selectAll",
	"click .details" : "navigateToDetails",
	"mouseover" : 'mouseover',
	"mouseout" : 'mouseout',
  },

  alternativesCollection : null,
  focusedUsers : {},

  initialize : function(options) {
	_(this).bindAll();
    
    this.model.bind('change', this.render);

	this.isExpanded = false;

	this.id = this.model.get('id');
	
	// i skip it for now. 
	//this.alternativesCollectionView = new App.Views.Alternatives.List({ collection: this.alternativesCollection, el: this.el });
	_(this).bindAll();
		
	notifier.register( this );
	eventer.register( this );
  },

  /*render : function() {

	this.alternativesCollection.item_url = window.location.pathname+"/"+this.model.get('id');
	this.alternativesCollection.url = window.location.pathname+"/"+this.model.get('id')+'/alternatives';

//	this.tempEL = document.createElement("tr");
//	this.tempEL.innerHTML = JST.items_index( {item: this.model} );

   this.el.innerHTML = JST.items_index( {item: this.model} );


   // nice localstorage status save
   if(  localStorage.getItem( this.model.get('id')+'expanded' ) == 'true' ) {
		this.expand();
	}

   jQuery(this.el).attr('id',this.model.get('id'));
   //

   return this;
  },
  */
  selectAll : function( e ){ 
	if( e.toElement.innerText == '(edit to add)') {
		document.execCommand('selectAll',false,null);
	}
	
  },
  editedItem : function( e ) {
     	// nasty but works.

		if (e.keyCode == 13) {
			var wasNew = this.model.isNew();
			var newValue = e.srcElement.innerText;

			if(newValue == "<br>") {
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
  	                $(trigger).fastConfirm('close');

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
                       $(trigger).fastConfirm('close');
               }
            });	
  },
  doExpand : function() {
		if( this.isExpanded == false) {
			this.expand();
		}
  },
  doCollapse : function() {
		if( this.isExpanded == true) {
			this.collapse();
		}
  },
  toggleExpand: function(){
		if( this.isExpanded == false) {
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
		projectId = jQuery(this.el).parents("div.projectDetailsWidget").attr('id');
		issueId = this.model.get('id');

		window.location.hash = 'projects/'+ projectId + '/issues/' + issueId + '/alternatives';

  },
  notify : function( broadcasted_id ) {

  },
  notifyEvent : function( data ){
  	//alert('here!');
  	d = JSON.parse(data)

  	if( d.id == this.model.get('id') ){
  		if( d.event.match('mouse') == null ) {
			this.alternativesCollection.fetch();
  		}
  	}


  	if( d.id == this.model.get('id') ){
		if( d.event == "mouseover") {
	  		jQuery(this.el).addClass("focused");
	  		this.focusedUsers[d.user] = (new Date()).getTime();
	  	}
	  	if( d.event == "mouseout" ) {
	  		jQuery(this.el).removeClass("focused");
	  		if( this.focusedUsers[d.user] ){
	  			delete this.focusedUsers[d.user];
	  		}
	  	}
	  	fuEl = jQuery("span.focusedUsers",this.el)[0];
	  	//fuEl.innerText = Object.keys(this.focusedUsers).length
	  	fuEl.innerHTML = "<br/>";
	  	_(this.focusedUsers).each(function(v,e){
	  		jQuery(fuEl).append("<img src='/images/icons/user.png' alt='"+e+"'><br/>");
	  	},this);
  	}
  },
	mouseover : function( e ){
		if( this.model.get('id') == null ) {
			return;
		}
		notifyCode = "jQuery.getJSON('/notify/" + this.model.get('id') + "/mouseover', function(data) {})"
		if( this.mouse_timer ){
			clearTimeout( this.mouse_timer );
		}
		this.mouse_timer = setTimeout(notifyCode,900); 
	},
	mouseout : function( e ){
		if( this.model.get('id') == null ) {
			return;
		}
		notifyCode = "jQuery.getJSON('/notify/" + this.model.get('id') + "/mouseout', function(data) {})"
		if( this.mouse_timer ){
			clearTimeout( this.mouse_timer );
		}
		this.mouse_timer = setTimeout(notifyCode,500); 
	},
});


App.Views.IssueList = Backbone.Marionette.CollectionView.extend({
	template: '#issueListTemplate',
	itemView : App.Views.IssueCompactView,
	events : {
		"click .newItem" : "newItem",
		"click .expandAll" : "expandAll",
		"click .collapseAll" : "collapseAll",
		"click .elicit" : "elicit",
	//	"click .newItem" : 'checkNewItem',
	},

  initialize : function() {

	_(this).bindAll();

//	this.collection.bind('saved',this.checkNewItem );
//	this.collection.bind('refresh',this.checkNewItem );
	
//	this.collection.on('change',this.render,this);
	//this.collection.comparator = function( m ) { return m.get('id'); };

    // simply magic :)
    /*if( window.location.pathname.match('projects') ) {
		this.projectid = window.location.pathname.match('projects\/.*\/items')[0].substring(9,33);
	}
	this._itemsCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : ItemUpdatingView,
      childViewTagName     : 'p',
	  childViewClassName   : 'itemList'
    });


	this.render();
	*/

	//notifier.register(this);
	this.on('close',this.onClose,this);
	eventer.register(this);

  },
 
/*  render : function() {			
		this._rendered = true;
		this.el.innerHTML="";
		
		
		this._itemsCollectionView.el = this.el; 		
		this._itemsCollectionView.render();
		//jQuery(this.el).prepend("<div class = 'button orange expandAll'>Expand all</div><div class = 'button orange collapseAll'>Collapse all</div>");


		buttons = "<p><b>Design issues in the context of the project:</b>" 
				+ "<div style='float: right'>"
			    + "<div class = 'button orange expandAll'>Expand all</div>" 
				+ "<div class = 'button orange collapseAll'>Collapse all</div>"
				+ "</div>"
				+ "<div style='float: left'>" 
				+ "<div class = 'button orange elicit'>Elicit issues</div>"
				+ "</div><br/><br/></p>"
		jQuery(this.el).prepend(buttons);

//		jQuery(this.el).prepend("<div class = 'button red newItem'>New!</div>");
		this.checkNewItem();

  },
  */
  removeNewItem : function() {
		this.collection.each( function( i ) {
			if( i.get('name') == '(edit to add)' ) {
				this.collection.remove( i );
				delete i;
			} 
		},this);
	
  },
  appendHtml: function(collectionView, itemView, index){
    collectionView.$el.prepend(itemView.el);
  },
  newItem : function() {
		collection = null;

		if( this.collection ) {
			// we're called from the render method
			collection = this.collection; 
		}
		else {
			// we're called because collection element has been saved 
			collection = this;			
		}

/*		var preLastItem = collection.last();
		if( preLastItem.view ) {
			preLastItem.view.expand();
		}
*/
		
		i = new Item;

		// this.newItemName is unavailable when called by the 'save' event from the collection
		i.set({name: '(edit to add)' });
		collection.add( i );
		
  },
  notify : function( broadcasted_id ) {
  },
  notifyEvent : function( data ) {
	  	d = JSON.parse(data)
	  	if( d.id == this.projectid ){
	  		if( d.event.match('mouse') == null ) {
	  			this.collection.fetch();
	  		}
	  	}
  },
  expandAll : function() {
	_.each(this._itemsCollectionView._childViews, function( childView ) {
		childView.expand();
	});
  },
  collapseAll : function() {
	_.each(this._itemsCollectionView._childViews, function( childView ) {
		childView.collapse();
	});
  },
  shortcut : function() {
	// alert("!");
  },
  checkNewItem : function() {
		this.removeNewItem();
		this.newItem();
  },
  elicit : function(){
		window.location.href = window.location.href +'#elicit';
  },
  onRender : function() {
  	var buttons = new App.Views.IssueListSpeedButtons({mainView: this});
  	layout.speedButtonsSidebar.show( buttons );
  },
  onClose : function(){
  	layout.speedButtonsSidebar.close();
  },
});

App.Views.IssueListSpeedButtons = Backbone.Marionette.View.extend({
	events : {
		'click div#newIssue' : 'newIssue',
		'click div#reuseIssue' : 'reuseIssue',
		'click div#expandAll' : 'expandAll',
		'click div#collapseAll' : 'collapseAll',
	},
	initialize : function(a){
		_(this).bindAll();
		this.mainView = a['mainView'];
		this.collection = this.mainView.collection;
	},
	render : function(){
		h="";
		h+="<div class='button green' id='newIssue'>New Issue</div>";
		h+="<div class='button green' id='reuseIssue'>Reuse Issue</div>";
		h+="<div class='button gray' id='expandAll'>Expand All</div>";
		h+="<div class='button gray' id='collapseAll'>Collapse All</div>";
		this.$el.html(h);
		//this.delegateEvents();
	},
	newIssue : function(){
		this.collection.create(null,{wait: true});
		jQuery(this.el).oneTime(1200,'some_focus',function(){jQuery("span.e6")[0].focus()});
	},
	reuseIssue: function(){
		alert('to be implemented');
	},
	expandAll: function(){
		_(this.mainView.children).each( function( v ) { v.doExpand() })
	},
	collapseAll: function(){
		_(this.mainView.children).each( function( v ) { v.doCollapse() })
	}

})


