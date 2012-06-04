

AlternativeUpdatingView  = Backbone.View.extend({
	className : "decision", 
    events : {
		"keypress div.name" 		: "editedName",
		"click div.name"			: 'selectAll',
		"click .deleteAlternative"	: "deleteAlternative",
		"click .unrelateAlternative": "unrelateAlternative",
		"click .decide"				: "decide",
		"click .undecide"			: "undecide",
		'mouseover'	: 'mouseover',
		'mouseout' : 'mouseout',

    },
    focusedUsers : {},

    initialize: function() {
		_(this).bindAll('render','decide','undecide','notifyEvent','mouseover','mouseout');
	    this.model.bind('change', this.render);
		notifier.register(this);
		eventer.register( this );
    },
    
    render: function() {

	   this.el.innerHTML = JST.alternatives_show( {a: this.model} );
	   jQuery(this.el).attr('id',this.model.id);
	   
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



		// autocompletition for the alterantives
	   if( this.model.isNew() ) {
			
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
					jQuery.getJSON( '/relations/relate?tip='+jQuery(this).parents("p").attr('id')+'&origin='+ui.item.id, function(data) {});
				},
				open: function() {
					jQuery( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
				},
				close: function() {
					jQuery( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
				}
			});
		}

	   // tooltip for decision rationale
/*	   jQuery("div.rationale#"+this.model.get('id'),this.el).cluetip({
			cluetipClass: 'rounded', 
			dropShadow: false, 
			sticky: true, 
			ajaxCache: false,
			activation: 'click',
			positionBy: 'fixed',
			});
*/
/* disabled for the campus branch
		jQuery("div.button.decide",this.el).tooltip({
			position: 'bottom center',
			tip: "div.tooltip",
			events: {
				def: "click, blur",
				input: "none, none",
				widget: "none, none",
				tooltip: "none, none",
				} 			
			});
*/
	   return this;
    },
    // this updates single row in the table
    update: function( item_id ){
    		
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
			var newValue = e.srcElement.innerHTML;

			if(newValue == "<br>") {
				newValue = '(empty)';
			}
			this.model.save(
				{ name: newValue },
				{ success : function( model, resp)  {
					model.parse( resp );
					model.change();
				}
			});			
		}
	
	},
	deleteAlternative : function(){
		var viewObject = this;
 		jQuery(".deleteAlternative",this.el).fastConfirm({
           position: "left",
              questionText: "Are you sure ?",
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
		//alert(element.target.id);
		rationaleDiv = jQuery("div.button.decide",this.el);

		jQuery("td.decisions", this.el).html("<img src='/images/ui-anim_basic_16x16.gif'/>");
	
		/* removed for the cmapus branch
			this.recordRationale();
		*/

		jQuery.getJSON( this.model.get('relation_url') + '/tag/dotag?from_taggable_id='+element.target.id+'&project_id='+this.model.get('project_id'), function(data) {
				/* removed for the campus branch 
				alert( 'here !');
				
			 	rationaleDiv.tooltip().show();	
				jQuery("div.rationaleText").focus();
				*/
				
				// nasty, nasty...
				//jQuery("div.tooltip").attr("id",data.$oid);
		});

	},
	undecide : function(element) {
		jQuery.getJSON( this.model.get('relation_url') + '/tag/untag?from_taggable_id='+element.target.id+'&project_id='+this.model.get('project_id'), function(data) {});		
		jQuery("td.decisions", this.el).html("<img src='/images/ui-anim_basic_16x16.gif'/>");
	},
	notify : function( broadcasted_id ) {
		if( this.model.id == broadcasted_id ) {
			this.model.fetch();
		//	jQuery(this.el).effect("highlight", {}, 500);	
		}
	},
	notifyEvent : function( data ){
	  	d = JSON.parse(data)
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
	recordRationale : function() {
				alert('and here!');
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
	},
});



App.Views.Alternatives.List = Backbone.View.extend({
  events : {
//	"click .newItem" : "newItem"
  },
  initialize : function() {
	this.alternativesCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : AlternativeUpdatingView,
      childViewTagName     : 'tr'
    });
	this.render();
	notifier.register(this);
	_(this).bindAll('newAlternative','removeNewAlternative','checkNewAlternative');
	_.extend( this, App.Helpers.ItemNavigation );
	this.collection.bind('saved', this.checkNewAlternative);
	this.collection.bind('refresh', this.checkNewAlternative);
  },
 
  render : function() {
		this.rendered = true;
		this.alternativesCollectionView.el = jQuery('table.alternativeList', this.el);
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

var rationaleDiv = null;

