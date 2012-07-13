/**
 * @author Marcin Nowak
 */
 
//require('backbone/application');

App.Views.Show = Backbone.View.extend({
	events: {
		"click .addTag": "addTag", 
		"keypress .editable" : "editedAttribute",
		"keydown div.editable"	: "specialKey",
		"click div.editable"	: "edit",
	},
    initialize: function() {
		//this.tagCollection = new Tags;
		_(this).bindAll('render','specialKey','edit','editedAttribute','notifyEvent');
		notifier.register(this);
		eventer.register(this);
		
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
		this.ne = null;

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

				//jQuery.getJSON( '/relations/relate?tip='+itemID+'&origin='+ui.item.id+'&relation_type=Tagging', function(data) {});
				jQuery.getJSON( '/tag/dotag?from_taggable_id='+ui.item.id+'&to_taggable_id='+itemID, function(data) {});
		
				
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
				//this.model.fetch();
			//this.tags.fetch();
//			jQuery(this.el).effect("highlight", {}, 500);	
	//		this.alternativesCollection.fetch();
	//		{deepRefresh: true}
		}
	},
	notifyEvent : function( e ) {
	  	d = JSON.parse(data)
	  	if( d.id == this.model.get('id') ){
	  		if( d.event.match('mouse') == null ) {
	  			this.model.fetch();
	  		}
	  	}
	},
	refresh : function () {
		this.model.fetch();
		this.aternativesCollection.fetch()
	},
	edit : function( e ){
	   //tas = jQuery("div.name",this.el);
	   tas = e.srcElement;

	   if( tas.localName != "div") {
	   	tas = jQuery(tas).parents("div.editable")[0];
	   }
	   //if( tas.length == 1 ) {
	   	//'fontSize','bold','italic','underline','strikeThrough','subscript','superscript'
	   	//buttonList : ['fontSize','bold','italic','underline','strikeThrough','subscript','superscript']}
	//   	if( this.ne == null ) {
	 	  	this.ne = new nicEditor({iconsPath : '/images/nicEditorIcons.gif', buttonList : ['bold','italic','underline','strikeThrough','ol','ul','link','unlink']}).panelInstance(tas);
	  //  }
	   //}
	},
	editedAttribute : function( e ) {
		if (e.keyCode == 13 && !e.shiftKey) {
				var newValue = e.srcElement.innerHTML;

				if(newValue == "<br>") {
					newValue = '(empty)';
				}

				this.model.set(e.srcElement.id,newValue);
				this.model.save();
				/*var changeSet = new Object;
				
				changeSet[e.srcElement.id] = newValue;
				this.model.save(
					changeSet,
					{ success : function( model, resp)  {
						
					}
				}
				);*/			
			}
			else {
				// in case this is not enter and that's first key pressed
				var newValue = e.srcElement.innerText;
				if( newValue == "(edit to add)"  ||
					newValue == "(empty)") {
					e.srcElement.innerHTML = "";
				}
			}
	},
	specialKey : function( e ){
		if( e.keyCode == 27 ){
			if( this.ne != null ){
				this.ne.removeInstance( e.srcElement );
				//jQuery("div.nicEdit-panelContain",this.el).remove();
				this.ne = null;
			}
			this.render();
			}
		},
});




