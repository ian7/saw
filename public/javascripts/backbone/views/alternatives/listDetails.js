

AlternativeDetailsUpdatingView  = Backbone.View.extend({
	className : "alternativeList", 
    events : {
//		"keypress div.name" 			: "editedName",
		"keypress .editable" : "editedAttribute",
		"click .editable" : "selectAll",
		"keypress .decisionRationale" : "editedRationale",
		"click div.name"				: 'selectAll',
		"click .deleteAlternative"	: "deleteAlternative",
		"click .unrelateAlternative": "unrelateAlternative",
		"click .decide"				: "decide",
		"click .undecide"			: "undecide"
    },
    initialize: function() {
		_(this).bindAll('render','decide','undecide','notify');
	    this.model.bind('change', this.render);


		notifier.register(this);		
    },
    
    render: function() {

	   this.el.innerHTML = JST.alternatives_showDetails( {a: this.model} );
	
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
		if( e.toElement.innerText == '(edit to add)') {
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

		// simple model recehck
		if( this.model.id == broadcasted_id ) {
			this.refetch();
		}

		// in case one of decisions changed
		_(this.model.attributes.decisions).each( function( decisionType ){
			_(decisionType.details).each( function( individualDecision ){
				if(individualDecision.decision_id == broadcasted_id)
					this.refetch();
			},this);
		},this);

	},
	refetch : function(){
			this.model.fetch({deepRefresh : 'true'});
			this.model.change();
			this.selectorView.relationsCollection.fetch();
			jQuery(this.el).effect("highlight", {}, 500);	
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
	editedRationale : function( e ) {
			if (e.keyCode == 13) {
				var newValue = e.srcElement.innerHTML;

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
	_(this).bindAll('render','newAlternative','removeNewAlternative','checkNewAlternative');

	this.collection.bind('saved', this.checkNewAlternative);
	this.collection.bind('refresh', this.checkNewAlternative);
	// load and render navigation helper
	_.extend( this, App.Helpers.ItemNavigation );

  },
 
  render : function() {
		this.rendered = true;
		this.renderNavigation();
		
		this.alternativesCollectionView.el = jQuery('table.alternativeListDetails', this.el);
		//this.alternativesCollectionView.el.innerHTML="";
		if( this.model )
			this.alternativesCollectionView.el.attr("id",this.model.id);
		this.alternativesCollectionView.render();
		this.checkNewAlternative();
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



