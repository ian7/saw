/**
 * @author Marcin Nowak
 */
 

App.Views.Relations.Selector = Backbone.View.extend({
	relationTypes : {
		"Implies" : "Alternative",
		"Contradicts" : "Alternative",
		"Influences" : "Issue",
		"Tagging"	: "",
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
		this.switchView( e.srcElement.id );
	},
  	switchView : function( relationType ) {
		// button id is set in the relations_selector.jst template, so we can recover it here
		// e.srcElement.id
		localStorage.setItem( this.model.get('id')+'showingRelation',relationType);

		this.relativesCollection.url = this.model.url()+'/relations/tree_to?type='+relationType;
		this.relativesCollection.fetch()		
		this.relativesView.relationType = relationType;
		jQuery(this.el).attr('id', relationType);
		this.relativesView.render();
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
		
       	this.el.html( JST.relations_selector({ relationCounts: this.relationCounts, relationTypes: this.relationTypes, ative: this.model } ));

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
		var lastViewedRelationType = localStorage.getItem( this.model.get('id')+'showingRelation' );
		if( lastViewedRelationType ) {
			this.switchView( lastViewedRelationType );
		}

		return this;
    },
   selectAll : function( e ){ 
		if( e.toElement.innerText == '(type to add new one)') {
			document.execCommand('selectAll',false,null);
		}
	},
});

