/**
 * @author Marcin Nowak
 */

jQuery.fn.flash = function( color, duration )
{
	duration = 50000;
    var current = this.css( 'color' );

    this.animate( { color: 'rgb(' + color + ')' }, duration / 2 );
    this.animate( { color: current }, duration / 2 );

}

 ItemUpdatingView = Backbone.View.extend({
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

  initialize : function(options) {
    this.render = _.bind(this.render, this); 
    this.model.bind('change', this.render);

	this.alternativesCollection = new Alternatives;
   
	this.alternativesCollection.issueView = this;
	this.isExpanded = false;

	// catch alternatives resource location hack
	this.alternativesCollection.item_url = window.location.pathname+"/"+this.model.get('id');
	this.alternativesCollection.url = window.location.pathname+"/"+this.model.get('id')+'/alternatives';
	
	this.alternativesCollectionView = new App.Views.Alternatives.List({ collection: this.alternativesCollection, el: this.el });
	_(this).bindAll('notify','mouseover','mouseout','notifyEvent');
		
	notifier.register( this );
	eventer.register( this );
  },

  render : function() {

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
  selectAll : function( e ){ 
	if( e.toElement.innerText == '(edit to add)') {
		document.execCommand('selectAll',false,null);
	}
	
  },
  editedItem : function( e ) {
     	// nasty but works.

		if (e.keyCode == 13) {
			var wasNew = this.model.isNew();
			var newValue = e.srcElement.innerHTML;

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
		/* timed saving has proven to be not so very sexy
         *
		 *
   	  	jQuery(this.el).stopTime("edit5");
	  	jQuery(this.el).oneTime(000,"edit5", function() {
			lastEditedItem.model.save(
				{ name: jQuery("span.e6",this).html() },
				{ success : function( model, resp)  {
					model.parse( resp );
					model.change();
				}
			});	
		});	
		*/
  },
  deleteItem : function() {
		var viewObject = this;
 		jQuery(".deleteItem",this.el).fastConfirm({
           position: "left",
              questionText: "Are you sure?",
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
			
			this.isExpanded = true;
			jQuery(".expand", this.el).html("Collapse");

			this.alternativesCollectionView.render();
			
		   	// WTF ? new App.Views.Alternatives.List({ collection: this.alternativesCollection, el: this.el });
			this.alternativesCollection.fetch({ silent: false,
				success: function(model, resp) {
//					model.issueView.model.change();
					//model.issueView.alternativesCollection = model;
					// this can be executed somewhere else :)					
				}
			});
		
  },
  collapse: function(){
		localStorage.removeItem( this.model.get('id')+'expanded');
		this.isExpanded = false;
		jQuery("table.alternativeList", this.el).html("<!-- nothing -->");
		jQuery(".expand", this.el).html("Expand");	
  },
  navigateToDetails : function () {
		window.location.href = window.location.href+"#/"+this.model.get('id')+'/alternatives';
  },
  notify : function( broadcasted_id ) {
		if( this.model.get('id') == broadcasted_id ) {
			this.alternativesCollection.fetch();
			jQuery(this.el).effect("highlight", {}, 50000);
		}
  },
  notifyEvent : function( data ){
  	//alert('here!');
  	d = JSON.parse(data)
  	if( d.id == this.model.get('id') ){
		if( d.event == "mouseover") {
	  		jQuery(this.el).addClass("focused");
	  	}
	  	if( d.event == "mouseout" ) {
	  		jQuery(this.el).removeClass("focused");
	  	}
  	}
  },
	mouseover : function( e ){
		jQuery.getJSON( '/notify/' + this.model.get('id') + '/mouseover' , function(data) {});
	},
	mouseout : function( e ){
		jQuery.getJSON( '/notify/' + this.model.get('id') + '/mouseout' , function(data) {});
	}

});

App.Views.Index = Backbone.View.extend({
  events : {
	"click .newItem" : "newItem",
	"click .expandAll" : "expandAll",
	"click .collapseAll" : "collapseAll",
	"click .elicit" : "elicit",
//	"click .newItem" : 'checkNewItem',
  },

  newItemName : '(new item)',

  initialize : function() {

	_(this).bindAll('newItem','checkNewItem','removeNewItem','newItem');

	this.collection.bind('saved',this.checkNewItem );
	this.collection.bind('refresh',this.checkNewItem );
	
	this.collection.comparator = function( m ) { return m.get('id'); };

    // simply magic :)
    if( window.location.pathname.match('projects') ) {
		this.projectid = window.location.pathname.match('projects\/.*\/items')[0].substring(9,33);
	}

	this._itemsCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : ItemUpdatingView,
      childViewTagName     : 'p',
	  childViewClassName   : 'itemList'
    });



	this.render();
	notifier.register(this);

  },
 
  render : function() {			
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
/*				+ "<div class = 'button black export' id='rtf'>Export RTF</div>"
				+ "<div class = 'button black export' id='rtf'>Export JSON</div>"
				+ "<div class = 'button black export' id='rtf'>Import JSON</div>";
				*/
		jQuery(this.el).prepend(buttons);

//		jQuery(this.el).prepend("<div class = 'button red newItem'>New!</div>");
		this.checkNewItem();

  },
  removeNewItem : function() {
		this.collection.each( function( i ) {
			if( i.get('name') == '(edit to add)' ) {
				this.collection.remove( i );
				delete i;
			} 
		},this);
	
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
/*		this.collection.each( function( i ) {	
			if( i.get('id') == broadcasted_id ) {
				i.fetch({
					success: function(model,resp) {
						model.change();
						jQuery(model.view.el).effect("highlight", {}, 500);
					}
				});
			}
		});
*/
		//var thisView = this;
		
		if( this.projectid == broadcasted_id ) {
			this.collection.fetch({
				success: function(model, resp){
//					thisView.colllection
//					thisView.render();
				}
			});
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
});


