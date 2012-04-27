App.Helpers.ItemNavigation = {
	navigationEvents  : {
		"click .toIndex" : "navigateToIndex",
		"click .itemShowNavigation" : "navigateItemShow"
	},
	firstRender : true,
	navigatedView : null,
	
	renderNavigation : function (){
		// this is to be called only once !
		
		if( this.firstRender ) {
			// we want to have it on top
			jQuery(this.el).prepend( JST.items_navigation({id:this.model.id}) );
			mixedEvents = new Object;
			// append our events
			_.extend( mixedEvents, this.events );
			_.extend( mixedEvents, this.navigationEvents);
			// delegate events
			this.delegateEvents( mixedEvents );
			// and bind handlers
		 	_(this).bindAll('navigateToIndex','navigateItemShow','updateButtons');
			
//			this.firstRender = false;
			
			var hash = window.location.href.match("#/.*/.*$");
			
			if( hash )	{
				this.navigatedView = hash[0].match("[a-z]*$")[0];
				this.updateButtons();
			}
		}
	},
	navigateToIndex : function() {
		index_url = window.location.href.match(".*#");
		// this removes trailing hash 
		index_url = index_url.splice(0,index_url.length-1);
		window.location.href = index_url;
	},
	navigateItemShow : function( e ) {
		this.navigatedView = e.srcElement.id;
		
		// destination is encoded in navigation link id attribute
		window.location.href = window.location.href.match(".*#")+'/'+this.model.id+'/'+this.navigatedView;
		this.updateButtons();
	},
	updateButtons : function() {
		// first remove rosy from all buttons
		jQuery("div.button.itemShowNavigation",this.el).removeClass("rosy");
		// add gray to all
		jQuery("div.button.itemShowNavigation",this.el).addClass("gray");		
		
		// now handle the one...
		jQuery("div.button.itemShowNavigation#"+this.navigatedView,this.el).removeClass("gray");
		// add gray to all
		jQuery("div.button.itemShowNavigation#"+this.navigatedView,this.el).addClass("rosy");
		
	}
};
