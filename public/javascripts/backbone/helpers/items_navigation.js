App.Helpers.ItemNavigation = {
	navigationEvents  : {
		"click .toIndex" : "navigateToIndex",
		"click .toAlternatives" : "navigateToAlternatives",
		"click .toVisualization" : "navigateToVisualization",
		"click .toDetails" : "navigateToDetails",
	},
	firstRender : true,
	
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
		 	_(this).bindAll('navigateToAlternatives','navigateToVisualization','navigateToDetails');
			
			this.firstRender = false;
		}
	},
	navigateToIndex : function() {
		window.location.href = window.location.href.match(".*#")	
	},
	navigateToDetails : function() {
		window.location.href = window.location.href.match(".*#")+'/'+this.model.id;
	},
	navigateToVisualization : function(){
		window.location.href = window.location.href.match(".*#")+'/'+this.model.id+'/visualization';
	},
	navigateToAlternatives : function(){
		window.location.href = window.location.href.match(".*#")+'/'+this.model.id+'/alternatives';			
	},
}