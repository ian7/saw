/**
 * @author Marcin Nowak
 */
 

App.Views.Relations.Selector = Backbone.View.extend({
	relationTypes : {
		"Implies" : "Alternative",
		"Contradicts" : "Alternative",
		"Influences" : "Issue",
//		"Tagging"	: "",
	},
	relationCounts : {},
	activeRelationType : null,
	events: {
		"click .switchView" : "switchClicked",
		"click .searchBox" : "selectAll",
	},
    initialize: function() {
		_(this).bindAll('render','switchView');

		// let's fetch some relations of this alternative...
		this.relationsCollection = new Relations;
		this.relationsCollection.bind('refresh',this.render);

		this.relativesCollection = new Relatives;
		this.relativesView = new App.Views.Relations.List( {el: this.el, collection: this.relativesCollection });

		this.relationsCollection.url = this.model.url()+'/relations/to';
		this.relationsCollection.fetch();

    },
	switchClicked : function( e ){
		if( e.srcElement.id != this.relativesView.relationType ) {
			this.switchView( e.srcElement.id );
		}
		else
		{
			this.switchView( null );
		}
	},
  	switchView : function( relationType ) {
	
		// in case we're changing to other view 
		if( relationType !=  null ) {		
			// button id is set in the relations_selector.jst template, so we can recover it here
			// e.srcElement.id
			localStorage.setItem( this.model.get('id')+'showingRelation',relationType);

			this.relativesCollection.url = this.model.url()+'/relations/tree_to?type='+relationType;
			this.relativesCollection.fetch()		
			this.relativesView.relationType = relationType;
			jQuery(this.el).attr('id', relationType);
			this.relativesView.render();
		
			// magic to make buttons go colorful
		
			// first remove rosy from all buttons
			jQuery("div.button.switchView",this.el).removeClass("rosy");
			// add gray to all
			jQuery("div.button.switchView",this.el).addClass("gray");

			// now handle the one...
			jQuery("div.button.switchView#"+relationType,this.el).removeClass("gray");
			// add gray to all
			jQuery("div.button.switchView#"+relationType,this.el).addClass("rosy");
			
			// show search box
			jQuery("div.searchBox",this.el).html("(type to add new one)");			
			jQuery("div.searchBox",this.el).show();			
			}
		else // otherwise if same button was clicked for the second time
			{
				localStorage.removeItem( this.model.get('id')+'showingRelation' );
				
				this.relativesView.relationType = null;
				this.relativesCollection._reset();
				this.relativesView.render();

				// first remove rosy from all buttons
				jQuery("div.button.switchView",this.el).removeClass("rosy");
				// add gray to all
				jQuery("div.button.switchView",this.el).addClass("gray");
				// hide search box
				
				jQuery("div.searchBox",this.el).hide();
				
			}
		
		
    },
    updateCounts : function() {

		// goes over collection of relations and does the sum-up
		this.relationCounts = new Object;
		this.relationsCollection.each( function( relation ) {

			if( !this.relationCounts[ relation.get('type') ] ) {
				this.relationCounts[ relation.get('type') ] = 1;
			}
			else {
				this.relationCounts[ relation.get('type') ] = this.relationCounts[ relation.get('type') ]  + 1;
			}

		},this);

	},
    render: function() {

	   
		this.updateCounts();
		
       	jQuery(this.el).html( JST.relations_selector({ relationCounts: this.relationCounts, relationTypes: this.relationTypes, ative: this.model } ));

		jQuery( "div.searchBox",this.el ).autocomplete({
			source: function( request, response ) {
				jQuery.ajax({
					url: "/search/"+request.term+'?type=Alternative',
					success: function( data ) {
						response( jQuery.map( data, function( item ) {
							return {
								label: item.name,
								value: item.name,
								id: item._id,
							}
						}));
					}
				});
			},
			minLength: 2,
			select: function( event, ui ) {
				// TODO: this is supper shitty...
				 
				var alternativeID = jQuery( this ).parents('tr').attr('id');
				var relationType = jQuery( this ).parents('div.relationSelector').attr('id');
				//alert( 'adsfasdf' );
				jQuery.getJSON( '/relations/relate?tip='+alternativeID+'&origin='+ui.item.id+'&relation_type='+relationType, function(data) {});
			},
			open: function() {
				jQuery( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
			},
			close: function() {
				jQuery( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
			}
		});

		// show list of related items by relation type...
		this.switchView( localStorage.getItem( this.model.get('id')+'showingRelation' ) );		

		return this;
    },
   selectAll : function( e ){ 
		if( e.toElement.innerText == '(type to add new one)') {
			document.execCommand('selectAll',false,null);
		}
	},
});

