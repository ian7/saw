/**
 * @author Marcin Nowak
 */


App.Views.ItemWidget = Backbone.View.extend({
	events: {
		"focus div.editable"	: "focused",
		"blur div.editable"		: "blured",
		"keyup div.editable"	: 'keyup',
		"click div.refresh" : "refresh",
	},
	nonAttributes : [
		"Your_decision",
		"Relation_id",
		"Relation_url",
		"Alternative_url",
		"Project_id",
		"id",
		"decisions",
		"type",
		"item_url",
		"undefined",
	],
	initialize : function() {
		_(this).bindAll();
		eventer.register(this);

	  	this.rendered = false;
	  	this.focusedAttribute = null;
		this.model.bind('change',this.refresh);
	  	this.ne = new nicEditor({iconsPath : '/images/nicEditorIcons.gif', buttonList : ['bold','italic','underline','strikeThrough','ol','ul','link','unlink'],hasPanel:true});
	},
	render : function() {

		h = "<table class='itemDetails'>"


    	_(this.model.attributes).each( function( v,a  ){
    		//el = jQuery("div.editable#"+a,this.el)[0];

    		isNonAttribute = false;

    		for( i=0; i<this.nonAttributes.length; i++){
    			if( this.nonAttributes[i].toLowerCase()==a.toLowerCase() ){
    				isNonAttribute = true;
    			}
    		}

	    	if( isNonAttribute == false){
	    		h += "<tr>";
	    		h += "<th>"+a.charAt(0).toUpperCase() + a.slice(1)+"</th>";
	    		h += "<td><div class='editable' id='" +a+ "' contenteditable='true'>";
	    		if (v == null || v.replace(/<(?:.|\n)*?>/gm, '') == "") {
		    		h += "(empty)";
	    		}
	    		else {
		    		h += v;		
	    		}
	    		h += "</div></td>";
				h += "</tr>"; 
	    	}
    	},this);


		h += "</table>"

		h += "<div class='debug'>Focus is on: <span class='focus'/><div class='button red refresh'>Refresh</div></div>";

		jQuery( this.el ).html(h);
		// this is way overgrown and not really needed. 
		// let's build it on our own.
		// jQuery(this.el).append( JST.items_show({ item: this.model }));
		this.rendered = true;
		this.delegateEvents();
		return this;
	},

	refresh : function() {
    	if( !this.el || jQuery("div.editable#name",this.el).length == 0 ){
    		this.render();
    		return;
    	}

    	// it surely has name
    	//jQuery("div.editable#name",this.el)[0].innerHTML = this.model.get('name');

    	_(this.model.attributes).each( function( v,a  ){
    		el = jQuery("div.editable#"+a,this.el)[0];
	    	if( el != null && el.id != this.focusedAttribute){
	    		if( v == null || v.replace(/<(?:.|\n)*?>/gm, '') == ""){
	    			el.innerHTML = "(empty)";
	    		}
	    		else {
	    			el.innerHTML = v;
	    		}
	    	}
    	},this);
	},

    focused : function( e ){
    	focusedAttributeName = e.target.id;

    	//console.log("focused on " + e.target.nodeName + " " +e.target.id + " target: " + e.target.nodeName + " " + e.target.id);

    	jQuery("span.focus",this.el)[0].innerText = focusedAttributeName;

    	try {
	  		this.ne.panelInstance(e.srcElement);
	  	}
	  	catch( e ) {
	  		console.log( "panel instance creation crashed with: " + e );
	  	}
	  	//this.ne.addInstance(e.srcElement);

	  	panelEl = jQuery("div.nicEdit-panelContain",jQuery(e.target).parent());


		jQuery.getJSON('/notify/' + this.model.get('id') + '/' + focusedAttributeName + '/focused', function(data) {});


	  	if(panelEl.length > 0) {
	  		panelEl.show();
	  	}


    	this.focusedAttribute = focusedAttributeName;
    },
    blured : function( e ){
    	console.log("blured on: " + e.srcElement.nodeName + " " + e.srcElement.id + " target: " + e.target.nodeName + " " + e.target.id);

		//magically hide the panel
		jQuery("div.nicEdit-panelContain",jQuery(e.srcElement).parent()).hide();

    	focusedAttributeName = e.srcElement.id;
    	
    	jQuery("span.focus",this.el)[0].innerText = "none";

    	this.model.set(focusedAttributeName,e.srcElement.innerHTML);
    	this.model.save();

    	this.focusedAttribute = null;

		jQuery.getJSON('/notify/' + this.model.get('id') + '/' + focusedAttributeName + '/blured', function(data) {});
    },
    keyup : function(e){
		this.model.set(focusedAttributeName,e.srcElement.innerHTML);
    	this.model.save();
    },
    notifyEvent : function( e ) {
	  	d = JSON.parse(e)
	  	if( d.id == this.model.get('id') ){
	  	 	switch( d.event ){
	  	 		case 'focused':
	  	 			jQuery("div.editable#"+d.attribute,this.el).parents("tr").addClass("focused");
	  	 			break;
	  	 		case 'blured':
	  	 			jQuery("div.editable#"+d.attribute,this.el).parents("tr").removeClass('focused');
	  	 			break;
	  	 		case 'updated':
		  			this.model.fetch();
		  			console.log("refreshing model");	  	 		
	  	 		default:
	  	 			break;
	  	 	}
	  	}
	},
});


App.Views.IssueDetails = Backbone.Marionette.ItemView.extend({
	template: '#issueDetailsTemplate',
	tagName: "div",
	events: {
		"click .addTag": "addTag", 
//	"keypress .editable" : "editedAttribute",
//		"keydown div.editable"	: "specialKey",
//		"click div.editable"	: "edit",
		"focus div.editable"	: "focused",
		"blur div.editable"		: "blured",
		"click div.refresh" : "refresh",
	},
    initialize: function() {
		_(this).bindAll();
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

//		this.alternativesCollection = new Alternatives;
//		this.alternativesCollection.issueView = this;


//		this.alternativesCollectionView = new App.Views.Alternatives.ListDetails({ collection: this.alternativesCollection, el: this.el });
		this.model = new Item();
		this.model.id = this.id;

		this.model.urlOverride = "/items/"+this.id;
		this.model.fetch();
		
	//	

/*
		jQuery(this.el).append( JST.items_show({ item: this.model }));


		this.tags = new Tags;
		this.tags.view = this;
	  	this.tagsView = new App.Views.Tags.List({collection: this.tags, el: this.el });
*/
	  	this.itemView = new App.Views.ItemWidget({el: this.el, model: this.model});
    },

/*    
    render: function() {
	//	this.ne = null;

		jQuery( this.el ).html("");
		this.renderNavigation();

		jQuery(this.el).append( JST.items_show({ item: this.model }));

		this.tags.url = this.model.url()+'/tag/tags_list';
		this.tags.fetch();
		this.tagsView.render();
		this.itemView.render();
		

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

    */
    onRender : function() {
    	this.itemView.render();
    },
    refresh : function(){
    	if( !this.el || jQuery("div.editable#name",this.el).length == 0 ){
    		this.render();
    		return;
    	}

    	// it surely has name
    	jQuery("div.editable#name",this.el)[0].innerHTML = this.model.get('name');

    	_(this.model.attributes).each( function( v,a  ){
    		el = jQuery("div.editable#"+a,this.el)[0];
	    	if( el != null && el.id != this.focusedAttributeName){
	    		el.innerHTML = v;
	    	}
    	},this);

    },
    focused : function( e ){
    	var focusedAttributeName = e.srcElement.id;

    	console.log("focused on " + e.srcElement.nodeName + " " +e.srcElement.id + " target: " + e.target.nodeName + " " + e.target.id);

    	jQuery("span.focus",this.el)[0].innerText = focusedAttributeName;

    	try {
	  		this.ne.panelInstance(e.srcElement);
	  	}
	  	catch( e ) {
	  		console.log( "panel instance creation crashed with: " + e );
	  	}
	  	//this.ne.addInstance(e.srcElement);

	  	panelEl = jQuery("div.nicEdit-panelContain",jQuery(e.srcElement).parent());


		jQuery.getJSON('/notify/' + this.model.get('id') + '/' + focusedAttributeName + '/focused', function(data) {});


	  	if(panelEl.length > 0) {
	  		panelEl.show();
	  	}


    	this.focusedAttribute = focusedAttributeName;
    },
    blured : function( e ){
    	console.log("blured on: " + e.srcElement.nodeName + " " + e.srcElement.id + " target: " + e.target.nodeName + " " + e.target.id);

		//magically hide the panel
		jQuery("div.nicEdit-panelContain",jQuery(e.srcElement).parent()).hide();

    	focusedAttributeName = e.srcElement.id;
    	
    	jQuery("span.focus",this.el)[0].innerText = "none";

    	this.model.set(focusedAttributeName,e.srcElement.innerHTML);
    	this.model.save();

    	this.focusedAttribute = null;

		jQuery.getJSON('/notify/' + this.model.get('id') + '/' + focusedAttributeName + '/blured', function(data) {});

		//if( this.ne != null ){
			//	this.ne.removeInstance( e.srcElement );
			//jQuery("div.nicEdit-panelContain",this.el).remove();
//			this.ne = null;
//		}

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
	  	/*d = JSON.parse(e)
	  	if( d.id == this.model.get('id') ){
	  	 	switch( d.event ){
	  	 		case 'focused':
	  	 			jQuery("div.editable#"+d.attribute,this.el).parents("tr").addClass("focused");
	  	 			break;
	  	 		case 'blured':
	  	 			jQuery("div.editable#"+d.attribute,this.el).parents("tr").removeClass('focused');
	  	 			break;
	  	 		case 'updated':
		  			this.model.fetch();
		  			console.log("refreshing model");	  	 		
	  	 		default:
	  	 			break;
	  	 	}
	  	}*/
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




