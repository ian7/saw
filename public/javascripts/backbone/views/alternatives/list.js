

App.Views.AlternativeCompactView  = Backbone.Marionette.ItemView.extend({
	template: '#alterntaiveCompactViewTemplate',
	tagName: "tr",
	templateHelpers: {
        get: function( variable ){
            try {
                if( this[variable] ){
                    return this[variable];
                }
                else{
                    return "(empty)";
                }
            }
            catch( e ){
                return ("(undefined)");
            }

        },
        renderDecisionButtons : function(){
        	// we'll return this 
        	h = "";

			if( !( this.your_decision && this.your_decision.name ) ) { 
			    _(this.decisions).each(function(decision) { 
			    	h += "<div class='button decide "+ decision.color.toLowerCase() +"'";
			    	h += "id='"+ decision.decision_tag_id + "' rel='whatever.html'>" + decision.name + "("+ decision.count + ")</div>";
				}, this);
			} else { 
				_(this.decisions).each(function(decision) {
					if( decision.name == this.your_decision.name ) { 
						h += "<div class='button undecide " +  decision.color.toLowerCase() + "' id='" + decision.decision_tag_id + "'>Revoke(" + decision.count + ")</div>";
					} 
					else { 
						h += "<div class='button disabled' id='" + decision.decision_tag_id +"'>" + decision.name +"(" + decision.count +")</div>"
					}
				},this); 
			}
			return(h);
        },
    },
	className : "decision", 
    events : {
		"keypress div.name" 		: "editedName",
		"keydown div.name"			: "specialKeyName",
//		"click div.name"			: 'selectAll',
		"click .deleteAlternative"	: "deleteAlternative",
		"click .unrelateAlternative": "unrelateAlternative",
		"click .decide"				: "decide",
		"click .undecide"			: "undecide",
		'mouseover'	: 'mouseover',
		'mouseout' : 'mouseout',
		'click div.name'	: 'edit',

    },
    focusedUsers : {},

    initialize: function() {
		_(this).bindAll('render','decide','undecide','notifyEvent','mouseover','mouseout','edit','specialKeyName','notify');
	    this.model.bind('change', this.render);
		notifier.register(this);
		eventer.register( this );
    },
    
  /*  render: function() {


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


	   this.el.innerHTML = JST.alternatives_show( {a: this.model} );

	   return this;
    },
*/
	onRender : function(){
		var color = "white";
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
		// this colors decisions 
		jQuery(this.el).removeClass().addClass("decision").addClass(color.toLowerCase());
	},
    edit: function( e ){
	   taName = this.model.get('id')+"nameEdit";
	   
//	   tas = jQuery("textarea#"+taName,this.el);
	   tas = jQuery("div.name",this.el);


	   if( tas.length == 1 ) {
	   	//'fontSize','bold','italic','underline','strikeThrough','subscript','superscript'
	   	//buttonList : ['fontSize','bold','italic','underline','strikeThrough','subscript','superscript']}
	   	this.ne = new nicEditor({iconsPath : '/images/nicEditorIcons.gif', buttonList : ['bold','italic','underline','strikeThrough','ol','ul','link','unlink']}).panelInstance(tas[0]);
	   }



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

		if (e.keyCode == 13 && !e.shiftKey) {
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
	specialKeyName : function( e ){
		if( e.keyCode == 27 ){
			if( this.ne != null ){
				this.ne.removeInstance( jQuery("div.name",this.el)[0] );
				//jQuery("div.nicEdit-panelContain",this.el).remove();
				this.ne = null;
			}
			this.render();
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
//			this.model.fetch();
		//	jQuery(this.el).effect("highlight", {}, 500);	
		}
	},
	notifyEvent : function( data ){
	  	d = JSON.parse(data)
	  	if( d.id == this.model.get('id') ){
	  		if( d.event.match('mouse') == null ) {
	  			this.model.fetch();
	  		}
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
		if( this.model.get('id') == null ) {
			return;
		}
		notifyCode = "jQuery.getJSON('/notify/" + this.model.get('id') + "/mouseover', function(data) {})"
		
		if( this.mouse_timer ){
			clearTimeout( this.mouse_timer );
		}
		this.mouse_timer = setTimeout(notifyCode,900); 
	},
	mouseout : function( e ){
		if( this.model.get('id') == null ) {
			return;
		}
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



App.Views.AlternativeCompactList = Backbone.Marionette.CollectionView.extend({
  template: '#alternativeCompactListTemplate',
  itemView: App.Views.AlternativeCompactView,
  events : {
  },
  initialize : function() {
	notifier.register(this);
	_(this).bindAll();
	_.extend( this, App.Helpers.ItemNavigation );
	//this.collection.bind('saved', this.checkNewAlternative);
	//this.collection.bind('refresh', this.checkNewAlternative);
  },
 /*
  render : function() {
		this.rendered = true;
		this.alternativesCollectionView.el = jQuery('table.alternativeList', this.el);
		this.alternativesCollectionView.render();
		this.checkNewAlternative();
  },
  */
  onRender : function() {
		jQuery( "div.spinner", this.el).hide();
  },
  notify : function( broadcasted_id ) {
  },
  notifyEvent : function( e ){
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

