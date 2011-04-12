App.Helpers.Items = {
	decide: function( alternativeURL, tagID ) {
		this.tag(alternativeURL, tagID );
		
		if( App.Components.Items ) {
			jQuery.getJSON( alternativeURL+'/notify', function(data) {
				    if(data) {
							alert(data);F
			            }
			        });
		}
	},
	// parameters: itemURL, tagID
	tag: function( itemURL, tagID ) {
		jQuery.getJSON( itemURL+'/tag/dotag?from_taggable_id='+tagID, function(data) {
			    if(data) {
						; //alert(data);
		            }
		        });

	},
	untag: function( relationID ) {},
}
