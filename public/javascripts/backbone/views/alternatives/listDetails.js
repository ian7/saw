

AlternativeDetailsUpdatingView  = Backbone.View.extend({
	className : "alternativeList", 
    events : {
		"keypress div.name" 			: "editedName",
		"click div.name"				: 'selectAll',
		"click .deleteAlternative"	: "deleteAlternative",
		"click .unrelateAlternative": "unrelateAlternative",
		"click .decide"				: "decide",
		"click .undecide"			: "undecide"
    },
    initialize: function() {
// WTF ?	    this.render = _.bind(this.render, this); 
		_(this).bindAll('render','decide','undecide');
	    this.model.bind('change', this.render);

		//this.decisionCollection = new DecisionDetails;
	    //this.decisionListView = new App.Views.Decisions.List( {collection: this.decisionDetails, el: this.el });

		notifier.register(this);
    },
    
    render: function() {

	   this.el.innerHTML = JST.alternatives_showDetails( {a: this.model} );
	    
	   // here we go with extracting single decisions into new models
	
	
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
	
		
	   return this;
    },
    selectAll : function( e ){ 
		if( e.toElement.innerText == '(new alternative)') {
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
              questionText: "Are you sure ?",
              onProceed: function(trigger) {
					viewObject.model.destroy();
                       $(trigger).fastConfirm('close');
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
		jQuery.getJSON( this.model.get('relation_url') + '/tag/dotag?from_taggable_id='+element.target.id, function(data) {});
	},
	undecide : function(element) {
		jQuery.getJSON( this.model.get('relation_url') + '/tag/untag?from_taggable_id='+element.target.id, function(data) {});		
	},
	notify : function( broadcasted_id ) {
		if( this.model.id == broadcasted_id ) {
			this.model.fetch();
			jQuery(this.el).effect("highlight", {}, 500);	
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
	this.render();
	notifier.register(this);
	_(this).bindAll('newAlternative','removeNewAlternative','checkNewAlternative');

	this.collection.bind('saved', this.checkNewAlternative);
	this.collection.bind('refresh', this.checkNewAlternative);
  },
 
  render : function() {
		this.rendered = true;
		this.alternativesCollectionView.el = jQuery('table.alternativeListDetails', this.el);
		this.alternativesCollectionView.el.innerHTML="";
		if( this.model )
			this.alternativesCollectionView.el.attr("id",this.model.get('id'));
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
		a.set({name: '(new alternative)' });
		this.collection.add( a );
  },

 removeNewAlternative : function() {
		this.collection.each( function( a ) {
			if( a.get('name') == '(new alternative)' ) {
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



