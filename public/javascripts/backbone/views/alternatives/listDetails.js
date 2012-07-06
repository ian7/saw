

AlternativeDetailsUpdatingView  = Backbone.View.extend({
	className : "alternativeList", 
    events : {
//		"keypress div.name" 			: "editedName",
		"keypress div.editable" : "editedAttribute",
		"keydown div.editable"	: "specialKey",
		"click div.editable" : "edit",
		"click .editable" : "selectAll",
		"keypress .decisionRationale" : "editedRationale",
		//"click div.name"				: 'selectAll',
		"click .deleteAlternative"	: "deleteAlternative",
		"click .unrelateAlternative": "unrelateAlternative",
		"click .decide"				: "decide",
		"click .undecide"			: "undecide",
		'mouseover'	: 'mouseover',
		'mouseout' : 'mouseout',

    },
    focusedUsers : {},
    initialize: function() {
		_(this).bindAll('render','decide','undecide','notify','notifyEvent');
	    this.model.bind('change', this.render);

		notifier.register(this);		
		eventer.register(this);

    },
    
    render: function() {
       el = jQuery(this.el);
       el.html("");
	
	   el.append(JST.alternatives_showDetails( {a: this.model} ));
	
	   jQuery(this.el).attr('id',this.model.id);
	    
		// let's render selector - it is passive - do it only if item is not new
		if( !this.model.isNew() ){
			this.selectorView = new App.Views.Relations.Selector( {model: this.model, el: jQuery('div.relationSelector',this.el) });
			this.selectorView.render();


			this.decisionsDetailsEl = jQuery("div.decisionsDetails",this.el);
			jQuery(this.decisionsDetailsEl).html( JST.decisions_details({ model: this.model } ));
		}
	
	   //this.decisionListView.render();
	   var thisModelId = this.model.get('id');

	   color = "white";
             
	   if( this.model.attributes.decisions ) {
		   _.each( this.model.attributes.decisions, function( decision ) {
			    if( decision.count > 0 ) {
					if( color == 'white' ) {
						color = decision.color;
					}
					else {
						color = 'gray';
					}
				}
			});
		}
		
		
	   // hell love chainging !
	   jQuery(this.el).removeClass().addClass("decision").addClass(color.toLowerCase());
	   jQuery(this.el).attr('id', this.model.get('id'));
	
	
	   if( this.model.isNew() ) {
			(function (jQuery) {
			   var original = jQuery.fn.val;
			   jQuery.fn.val = function() {
			      if (jQuery(this).is('[contenteditable]')) {
			         return jQuery.fn.text.apply(this, arguments);
			      };
			      return original.apply(this, arguments);
			   };
			})(jQuery);
		
			jQuery( "div.name",this.el ).autocomplete({
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
//					alert( ui.item.id );
					jQuery.getJSON( '/relations/relate?tip='+jQuery('table.alternativeListDetails').attr('id')+'&origin='+ui.item.id, function(data) {});
				},
				open: function() {
					jQuery( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
				},
				close: function() {
					jQuery( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
				}
			});
			
	}
	
	// rationale recording stuff
	
/*	
	jQuery("div.button.decide",this.el).tooltip({
		position: 'center left',
		tip: "div.tooltip",
		events: {
			def: "click, blur",
			input: "none, none",
			widget: "none, none",
			tooltip: "none, none",
			} 
		});
	
	jQuery("div.rationaleText").keydown( function( e ) {

		// if there is still decision id attached to the tooltip div
		if( jQuery("div.tooltip").attr('id') ) {

			// escape pressed
			if( e.keyCode == 27 ){
				jQuery("div.tooltip").hide();				
			}
			// enter pressed
			if( e.keyCode == 13 ) {
				jQuery("div.tooltip").hide();
				// save the contents
				jQuery.ajax({
					url: "/rationales",
					type: 'POST',
					dataType: "json",
					data: {
						name: jQuery("div.rationaleText").text(),
						decision_id: jQuery("div.tooltip").attr('id'),
					}
				});
				jQuery("div.tooltip").removeAttr('id');
				jQuery( "div.rationaleText" ).autocomplete().close();
			}
		}

	});

	jQuery( "div.rationaleText" ).autocomplete({
		source: function( request, response ) {
			jQuery.ajax({
				url: "/search/"+request.term+'?type=Rationale',
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
		minLength: 0,
		select: function( event, ui ) {
			//alert( ui.item.id );
			jQuery.getJSON( '/relations/relate?tip='+jQuery(this).parent().attr('id')+'&origin='+ui.item.id+'&relation_type=Tagging', function(data) {});
			jQuery("div.tooltip").hide();	
		},
		open: function() {
			jQuery( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
		},
		close: function() {
			jQuery( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
		}
	});
	
	
	
	
	
	// enable tooltips for the rationale
	jQuery('div.rationaleDiv#enabled',this.el).tooltip({
		position: 'center left',
		title: 'Rationale:'
	});
		*/
	   return this;
    },
    selectAll : function( e ){ 
		if( e.toElement.innerText == '(edit to add)' ||
			e.toElement.innerText == '(empty)') {
			document.execCommand('selectAll',false,null);
		}
	},
	editedName : function( e ) {
		// nasty but works.
	    //var lastEditedItem = this;

		if (e.keyCode == 13) {
			this.model.save(
				{ name: jQuery("div.name",this.el).html() },
				{ success : function( model, resp)  {
					model.parse( resp );
					model.change();
				}
			});			
		}
		/*
		
	  	jQuery(this.el).stopTime("edit5");
	  	jQuery(this.el).oneTime(1000,"edit5", function() {
		//	if( lastEditedItem.model.isNew() ) {
		//		lastEditedItem.trigger("new");
		//	}
			lastEditedItem.model.save(
				{ name: jQuery(".name",this).html() },
				{ success : function( model, resp)  {
					model.parse( resp );
					lastEditedItem.trigger('saved');
					lastEditedItem = null;
				}
			});	
		});
		*/
	},
	deleteAlternative : function(){
		var viewObject = this;
 		jQuery(".deleteAlternative",this.el).fastConfirm({
           position: "left",
              questionText: "Are you sure?",
              onProceed: function(trigger) {
                    $(trigger).fastConfirm('close');
					viewObject.model.destroy();
               },
               onCancel: function(trigger) {
                    $(trigger).fastConfirm('close');
               }
            });	
	},
	unrelateAlternative : function() {
		;
	},
	decide : function (element) {
		rationaleDiv = jQuery("div.button.decide",this.el);

		//alert(element.target.id);
		jQuery.getJSON( this.model.get('relation_url') + '/tag/dotag?from_taggable_id='+element.target.id+'&project_id='+this.model.get('project_id'), function(data) {
		/*	rationaleDiv.tooltip().show();	
			jQuery("div.rationaleText").focus();

			// nasty, nasty...
			jQuery("div.tooltip").attr("id",data.$oid);
		 */	
		});
		
		jQuery("table.decisions", this.el).block({ message: null });
	},
	undecide : function(element) {
		jQuery.getJSON( this.model.get('relation_url') + '/tag/untag?from_taggable_id='+element.target.id+'&project_id='+this.model.get('project_id'), function(data) {});		
		jQuery("table.decisions", this.el).block({ message: null });
	},
	notify : function( broadcasted_id ) {


	},
	notifyEvent : function( data ){
	  	d = JSON.parse(data)
	  	if( d.event.match('mouse') == null ){
			// simple model recehck
			if( this.model.id == d.id ) {
				this.refetch();
			}

			// in case one of decisions changed
			_(this.model.attributes.decisions).each( function( decisionType ){
				_(decisionType.details).each( function( individualDecision ){
					if(individualDecision.decision_id == broadcasted_id)
						this.refetch();
				},this);
			},this);
	  	}

	  	if( d.id == this.model.get('id') ){
			if( d.event == "mouseover") {
		  		jQuery(this.el).addClass("focused");
		  		this.focusedUsers[d.user] = (new Date()).getTime();
		  	}
		  	if( d.event == "mouseout" ) {
		  		jQuery(this.el).removeClass("focused");
		  		delete this.focusedUsers[d.user];
		  	}
	  	fuEl = jQuery("span.altenrnativeFocusedUsers",this.el)[0];
	  	if( fuEl ){
		  	fuEl.innerText = "";
			  	_(this.focusedUsers).each(function(v,e){
			  		jQuery(fuEl).append("<img src='/images/icons/user.png' alt='"+e+"'>");
			  		//("+Object.keys(this.focusedUsers).length+")");
			  	},this);
	  		}

		}
	},
	mouseover : function( e ){
		notifyCode = "jQuery.getJSON('/notify/" + this.model.get('id') + "/mouseover', function(data) {})"
		
		if( this.mouse_timer ){
			clearTimeout( this.mouse_timer );
		}
		this.mouse_timer = setTimeout(notifyCode,900); 
	},
	mouseout : function( e ){
		notifyCode = "jQuery.getJSON('/notify/" + this.model.get('id') + "/mouseout', function(data) {})"
		if( this.mouse_timer ){
			clearTimeout( this.mouse_timer );
		}
		this.mouse_timer = setTimeout(notifyCode,500); 
	},

	refetch : function(){
			this.model.fetch({deepRefresh : 'true'});
			this.model.change();
			this.selectorView.relationsCollection.fetch();
//			jQuery(this.el).effect("highlight", {}, 500);	
	},

	editedAttribute : function( e ) {
			if (e.keyCode == 13 && !e.shiftKey) {
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
			else {
				// in case this is not enter and that's first key pressed
				var newValue = e.srcElement.innerText;
				if( newValue == "(edit to add)"  ||
					newValue == "(empty)") {
					e.srcElement.innerHTML = "";
				}
			}
	},
	edit : function( e ){
	   //tas = jQuery("div.name",this.el);
	   tas = e.srcElement;
	   //if( tas.length == 1 ) {
	   	//'fontSize','bold','italic','underline','strikeThrough','subscript','superscript'
	   	//buttonList : ['fontSize','bold','italic','underline','strikeThrough','subscript','superscript']}
	   if( tas.localName != "div") {
	   	tas = jQuery(tas).parents("div.editable")[0];
	   }
	   	this.ne = new nicEditor({iconsPath : '/images/nicEditorIcons.gif', buttonList : ['bold','italic','underline','strikeThrough','ol','ul','link','unlink']}).panelInstance(tas);
	   //}
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
	editedRationale : function( e ) {
			if (e.keyCode == 13) {
				var newValue = e.srcElement.innerText;

				if(newValue == "<br>") {
					newValue = '(empty)';
				}

				element = jQuery(e.srcElement);
				// this is actually quite nice
	            jQuery.ajax({
		         	type: 'PUT',
		         	url: '/r/'+element.attr('id')+'/Rationale',
		         	data: element.html()   	 
		         });       	  		
			}
			else {
				// in case this is not enter and that's first key pressed
				var newValue = e.srcElement.innerText;
				if( newValue == "(empty)" ) {
					e.srcElement.innerHTML = "";
				}
			}
	},

});



App.Views.Alternatives.ListDetails = Backbone.View.extend({
  events : {
//	"click .newItem" : "newItem"
  },
  initialize : function() {
	this.alternativesCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : AlternativeDetailsUpdatingView,
      childViewTagName     : 'tr'
    });

	notifier.register(this);
	_(this).bindAll('renderHeader','render','newAlternative','removeNewAlternative','checkNewAlternative');

	this.collection.bind('saved', this.checkNewAlternative);
	this.collection.bind('refresh', this.checkNewAlternative);
	this.model.bind('change',this.renderHeader);
	// load and render navigation helper
	_.extend( this, App.Helpers.ItemNavigation );

  },
 
  render : function() {
		this.rendered = true;
		el = jQuery(this.el);
		//el.html("");
		el.prepend("<div class='header'></div>");
		this.renderNavigation();
		
		this.alternativesCollectionView.el = jQuery('table.alternativeListDetails', this.el);
		//this.alternativesCollectionView.el.innerHTML="";
		if( this.model )
			this.alternativesCollectionView.el.attr("id",this.model.id);
		this.alternativesCollectionView.render();
		this.checkNewAlternative();
  },
  renderHeader : function(){
  		el = jQuery('div.header',this.el);
  		el.html("Issue: <b>"+this.model.get('name')+"</b>");
  },
  notify : function( broadcasted_id ) {
		this.collection.each( function( i ) {	
/*			if( i.get('id') == broadcasted_id ) {
				i.fetch();
				i.change();
			}
			*/
		});
  },
  newAlternative : function() {	
		a = new Alternative;
		// this.newItemName is unavailable when called by the 'save' event from the collection
		a.set({name: '(edit to add)' });
		this.collection.add( a );
		jQuery("div.nextEdited").focus();
  },

 removeNewAlternative : function() {
		this.collection.each( function( a ) {
			if( a.get('name') == '(edit to add)' ) {
				this.collection.remove( a );
				delete a;
			} 
		},this);

  },
  checkNewAlternative : function () {
	this.removeNewAlternative();
	this.newAlternative();
  },
});



