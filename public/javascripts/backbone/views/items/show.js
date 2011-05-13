/**
 * @author Marcin Nowak
 */
 
//require('backbone/application');

App.Views.Show = Backbone.View.extend({
	events: {
		"click .addTag": "addTag", 
		"keypress .editable" : "editedAttribute",
	},
    initialize: function() {
		//this.tagCollection = new Tags;
		_(this).bindAll('render');
		notifier.register(this);
		
		// load and render navigation helper
		_.extend( this, App.Helpers.ItemNavigation );

      /* let's forget about that for a moment
  		_.extend( this, Backbone.Events );
        
        this.bind('update',function( item_id ){
        	if( App.Components.Items.tags ){
        		App.Components.Items.tags.trigger('update',item_id);
        	}
        	
        	if( App.Components.Items.alternatives ){
        		App.Components.Items.alternativess.trigger('update',item_id);
        	}
        });
*/

		this.alternativesCollection = new Alternatives;
		this.alternativesCollection.issueView = this;


//		this.alternativesCollectionView = new App.Views.Alternatives.ListDetails({ collection: this.alternativesCollection, el: this.el });

		this.model.bind('change',this.render);

		this.tags = new Tags;
		this.tags.view = this;
	  	this.tagsView = new App.Views.Tags.List({collection: this.tags, el: this.el });
    },
    
    render: function() {
		jQuery( this.el ).html("");
		this.renderNavigation();

/*		this.alternativesCollection.item_url = this.model.url();
		this.alternativesCollection.url = this.model.url()+'/alternatives';
		this.alternativesCollection.fetch();*/

		jQuery(this.el).append( JST.items_show({ item: this.model }));

		this.tags.url = this.model.url()+'/tag/tags_list';
		this.tags.fetch();
		this.tagsView.render();
		
/*		jQuery("div.searchBox").click( function(e) {
			//alert('here');
			jQuery(this).append("<div><table><tr><td>a</td></tr><tr><td>b</td></tr><tr><td>c</td></tr></div>")
		});
*/		
	/*	jQuery("div.searchBox",this.el).click( function() {
			jQuery( this ).trigger('open');
			});
	*/
		var availableTags = null;
		var itemUrl = this.model.url();
		
		
		jQuery("div.searchBox", this.el).click(function(e) {
			document.execCommand('selectAll',false,null);
			
		});


		jQuery.widget( "custom.catcomplete", jQuery.ui.autocomplete, {
				_renderMenu: function( ul, items ) {
					var self = this,
						currentCategory = "";
					jQuery.each( items, function( index, item ) {
						if ( item.type != currentCategory ) {
							ul.append( "<li class='ui-autocomplete-category'>" + item.type + "</li>" );
							currentCategory = item.type;
						}
						self._renderItem( ul, item );
					});
				}
			});
					
		jQuery( "div.searchBox",this.el ).catcomplete({
			source: function(request, response) {
				var searchTerm = request.term;
				
				if( searchTerm == "(type to search)" ) {
					searchTerm = "";
				}
				
				var r = new RegExp( searchTerm, "i");
				if( availableTags ) {
					response( 
						jQuery.map( availableTags, function( item ) {
							if( item.name.match( r ) || item.type.match( r ) ) {							
								return {
									label: item.name,
									value: item.name,
									type: item.type,
									id: item.id,
								};
							} 
							else {
								return null;
							}
						}));				
				}
				else {
					jQuery.ajax({
						url: itemUrl + '/tag/list.json',
						success: function( data ) {
							availableTags = data;
							response( 
								jQuery.map( data, function( item ) {
								return {
									label: item.name,
									value: item.name,
									type: item.type,
									id: item.id,
								}
							}));
						}
					});
				}
			},
			minLength: 0,
			delay: 0,
			select: function( event, ui ) {
				// TODO: this is supper shitty... but works so sweet !
				var itemID = jQuery("table.itemDetails").attr('id');

				jQuery.getJSON( '/relations/relate?tip='+itemID+'&origin='+ui.item.id+'&relation_type=Tagging', function(data) {});
				
				// clean up the searchBox
				jQuery("div.searchBox").html("");
			},
			open: function() {
				jQuery( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
			},
			close: function() {
				jQuery( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
				jQuery("div.searchBox").html("(type to search)");
			},
			focus: function() {
//				this.open();
			}
		});

		
		return( this );

    },
	addTag: function(){
		this.tags = new Tags;
		this.tags.url = this.model.get('item_url')+'/tag/list';
		this.tags.view = this;
		
		this.tags.fetch({
			success: function( model, resp ){
				new App.Views.Tags.AddTag({ collection: this.tags, el: 'table.tagsList' })
			}
		});
	},
	notify: function( broadcasted_id ) {
		if( this.model.get('id') == broadcasted_id ){
				this.model.fetch({
					success : function( model, resp ){
//						model.change();
//						model.view.render();
					},
				});
		this.tags.fetch();
//		this.alternativesCollection.fetch();
//		{deepRefresh: true}
		}
	},
	refresh : function () {
		this.model.fetch();
		this.aternativesCollection.fetch()
	},
	editedAttribute : function( e ) {
			if (e.keyCode == 13) {
				var newValue = e.srcElement.innerHTML;

				if(newValue == "<br>") {
					newValue = '(empty)';
				}
				var changeSet = new Object;
				
				changeSet[e.srcElement.id] = newValue;
				this.model.save(
					changeSet,
					{ success : function( model, resp)  {
						
					}
				});			
			}
	
	},
});




