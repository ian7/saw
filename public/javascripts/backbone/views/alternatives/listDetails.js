

App.Views.AlternativeDetailsView  = Backbone.Marionette.ItemView.extend({
	template : "#alternativeDetailsViewTemplate",
	className : "alternativeList", 
	tagName : 'tr',
    events : {
		"click div.deleteAlternative"	: "deleteAlternative",
		"click .unrelateAlternative": "unrelateAlternative",
		"click .decide"				: "decide",
		"click .undecide"			: "undecide",
		'click #editRationale'		: 'editRationale',
		'click #sealDecision'		: 'sealDecision',
		'mouseover'	: 'mouseover',
		'mouseout' : 'mouseout',
    },
    templateHelpers : {
    	decisionTable : function(param){

    		// for executing out of the template (refreshing)
    		if( param ){
    			that = param;
    		}
    		else
    			that = this;

    		h = ""

			for( var decisionId in that['decisions'] ) { 

				var decision = that['decisions'][decisionId];
				var your_decision = that['your_decision'];
				h += "<tr>" 
				   	+ "<!-- for a moment let's hide it-->";

/*					+ "<td class='hidden'>"

					+ "<!-- here comes the insert -->"
					+ "<table class='decisionList'>"					
					+ "<!-- here we enter single decisions -->";
				for( var detailId in decision.details) { %>
												<tr class="decision <%= decision.color.toLowerCase() %>">
												<td class="user">
													<% if( detail.rationale) { %>
														<div class="rationaleDiv" id="enabled">
													<% } else { %>
														<div class="rationaleDiv"> 
													<% } %>
															<img src="/images/icons/user.png"/><%= detail.email %>
														</div>
													<div class="rationaleTip tooltip">
														<b>Taken:</b><div class="content"> <%= detail.timestamp %></div> <br/>
														<b>Rationale:</b><br/>
														<div class="content"><%= detail.rationale %></div>
													</div>
												</td>
											</tr>
										<% }); %>
								</table>
							</td>
							*/
				h += "<td class='buttons'>";
					if( !( your_decision && your_decision.name ) ) { 
						// <!-- branch in which you dont have your decision -->
						h += "<div class='button decide " +  decision.color.toLowerCase() + "' id='" +  decision.decision_tag_id +"'>"  
						   + decision.name + "(" + decision.count +")</div>";
					} 
					else { 
						// <!-- branch in which you have your decision -->
							if( decision.name == your_decision.name ) { 
						    		h += "<div class='button undecide " + decision.color.toLowerCase() + "' id='" + decision.decision_tag_id + "'>Revoke("
						    		   + decision.count + ")</div>";
								} 
								else { 
									h += "<div class='button disabled' id='" + decision.decision_tag_id + "'>" + decision.name + "(" + decision.count + ")</div>";
								}
					} 							
					h += "</td></tr>";
				} 
			return( h );
    	},
    },
    focusedUsers : {},
    initialize: function() {
    	// bind them all!
		_(this).bindAll();
	    
	    this.model.bind('change', this.refresh);

		//this.model.bind('change', this.render);
		notifier.register(this);		
		eventer.register(this);
		//this.el = el;

		// creating itemAttributes widget, but not setting element value
		// this.el needs to be set in render function in order to support cascading redering.
        this.itemAttributesWidget = new App.Views.ItemWidget( {model: this.model });

        // this should set html element id... (should)
        this.id = this.model.id;


    },  
    onRender : function(){
    	// general item attributes widget:
		this.itemAttributesWidget.el = jQuery("div.itemAttributes",this.el);
		this.itemAttributesWidget.$el = jQuery("div.itemAttributes",this.el);
		this.itemAttributesWidget.render();
		this.fixDecisionColorBackground();

        this.decisionListWidget = new App.Views.DecisionListWidget({model: this.model, el: jQuery("div.decisionsDetails",this.el)});
        this.decisionListWidget.render();
    },
    fixDecisionColorBackground : function(){
		// alternative coloring...
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


		// hell love chainging !
		jQuery(this.el).removeClass().addClass("decision").addClass(color.toLowerCase());
		jQuery(this.el).attr('id', this.model.get('id'));
	

    },
    editRationale : function() {
    	var rationaleWidget = new App.Views.RationaleWidget({model:this.model});
    	layout.modal.show( rationaleWidget );
    },
    sealDecision : function(){
	  	//TBD
	  	alert('to be implemented');
	},

 /*44444444
    render: function() {

       el = jQuery(this.el);
       el.html(JST.alternatives_showDetails( {a: this.model} ));
       
		// this.el needs to be set in render function in order to support cascading redering.
       this.itemAttributesWidget.el = jQuery("div.itemAttributes",this.el)[0];
       this.itemAttributesWidget.render();


       // rendering item attributes 
       //jQuery("div.itemAttributes",this.el).html( JST.)


	  	//el.append(JST.alternatives_showDetails( {a: this.model} ));
		//el.html("<b>here!</b>");

		//this.itemView = new App.Views.ItemWidget({el: jQuery("div.itemAttributes",this.el), model: this.model});

	   jQuery(this.el).attr('id',this.model.id);	    
444444444*/
/*

		// let's render selector - it is passive - do it only if item is not new
		if( !this.model.isNew() ){
			this.selectorView = new App.Views.Relations.Selector( {model: this.model, el: jQuery('div.relationSelector',this.el) });
			this.selectorView.render();


			this.decisionsDetailsEl = jQuery("div.decisionsDetails",this.el);
			jQuery(this.decisionsDetailsEl).html( JST.decisions_details({ model: this.model } ));
		}

*/	

/* 222222222
	   //this.decisionListView.render();
	   var thisModelId = this.model.get('id');

	
	
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
222222 */	
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
		/*44444444444444444
	   return this;
    },
    4444444444*/
    refresh : function (){
    	console.log('alternativeDetails.refresh');
    	jQuery("td.decisions table.decisions").unblock();
    	jQuery("td.decisions table.decisions tbody",this.el).html( this.templateHelpers.decisionTable( this.model.attributes ) );
    	this.fixDecisionColorBackground();
    },
    focused : function( e ) {

    },
    blured : function( e ) {

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
		if( confirm("Are you sure that you want to delete this alternative?")){
			this.model.destroy();
		}
	},
	unrelateAlternative : function() {
		;
	},
	decide : function (element) {
		rationaleDiv = jQuery("div.button.decide",this.el);

		//alert(element.target.id);

		jQuery.getJSON( this.model.get('relation_url') + '/tag/dotag?from_taggable_id='+element.target.id+'&project_id='+this.model.get('project_id'), function(data) {});		

		/*
	    jQuery.ajax({
		 	type: 'GET',
		 	url: this.model.get('relation_url') + '/tag/dotag?from_taggable_id='+element.target.id+'&project_id='+this.model.get('project_id'),
		 	data: "",   
		 	complete: function(){
				
		 	}
		 });
		*/

		//for many reasons this is difficult....
		this.editRationale(); 		

		jQuery("table.decisions", this.el).block({ message: null });
	},
	undecide : function(element) {
		jQuery.getJSON( this.model.get('relation_url') + '/tag/untag?from_taggable_id='+element.target.id+'&project_id='+this.model.get('project_id'), function(data) {});		
		jQuery("table.decisions", this.el).block({ message: null });
	},
	notify : function( broadcasted_id ) {

		// simple model recehck

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
					if(individualDecision.decision_id == d.id)
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
			
			//TODO: fix it
			// this.selectorView.relationsCollection.fetch();
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





App.Views.AlternativeDetailsWidget = Backbone.Marionette.CompositeView.extend({
	template: "#alternativeDetailsWidget",
	itemView : App.Views.AlternativeDetailsView,
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
    },
    events: {
    	'click div#newAlternative' : 'newAlternative',
    	'click div#reuseAlternative' : 'reuseAlternative',
    	'keyup input#filter'	: 'filter',
    	'click input#undecided'	: 'filter',
    	'click input#decided' : 'filter',
    },
	initialize : function(){
		_(this).bindAll();

		this.collection = new Alternatives();
		var issueId = arguments[0]['issueId'];
		var projectId = arguments[0]['projectId'];

		this.project = new Backbone.Model();
		this.project.url = "/projects/"+projectId;
		this.project.id = projectId;
		this.project.fetch();

		this.issue = new Item();

		this.issue.urlOverride = "/projects/"+projectId+"/items/"+issueId;
		this.issue.id = issueId;
		this.issue.fetch();

		this.model = this.issue;
		this.model.on('change',this.render,this);

		this.collection.item_url = "/projects/"+projectId+"/items/"+issueId;
		this.collection.urlOverride = this.collection.item_url+"/alternatives";
		this.collection.fetch();
		
		this.on('close',this.onClose,this);

	},
	onClose : function(){
	    	layout.speedButtonsSidebar.close();
	},
	onRender : function(){
	/*	this.alternativeList = new App.Views.AlternativeListDetails({
				el: jQuery("table.alternativeListDetails",this.el), 
				collection: this.collection,
			});
		this.alternativeList.render();
		*/
		buttons = new App.Views.AltenrativeListSpeedButtons({collection: this.collection});
		layout.speedButtonsSidebar.show( buttons );

	},
	appendHtml : function( collectionView, itemView, index ) {
		//collectionView.$el.prepend(itemView.el);
		jQuery("table.alternativeListDetails",collectionView.el).prepend(itemView.el);
	},
	newAlternative : function(){
		this.collection.create(null,{wait: true});
	},
	reuseAlternative : function(){
		//TBD
		alert('not implemented yet');
	},
	filter : function(){
		var filter = jQuery("input#filter",this.el)[0].value;


		for( var viewId in this.children ) {
			itemView = this.children[viewId]

			var matchedFilter = false;
			var matchedDecided = false;
			var matchedUnDecided = false;
			var matchedColliding = false;


			// if there is something to filter, then filter, empty string matches everything
			for( var property in itemView.model.attributes ){
				if( itemView.model.attributes[property] &&
					typeof(itemView.model.attributes[property]) == "string" &&
					itemView.model.attributes[property].toLowerCase().match(filter)){
						matchedFilter = true;
				}
			}

			// filter by the state
			// decided?
			if( jQuery("input#decided",this.el)[0].checked && itemView.model.isDecided() ){
				matchedDecided = true;
			}
			// colliding?
			if( jQuery("input#colliding",this.el)[0].checked && itemView.model.isColliding() ){
				matchedColliding = true;
			}
			// undecided?
			if( jQuery("input#undecided",this.el)[0].checked && !itemView.model.isDecided() ){
				matchedUnDecided = true;
			}

			// finally logic
			if( matchedFilter && (matchedDecided || matchedColliding || matchedUnDecided) ){
				itemView.$el.show();
			}
			else{
				itemView.$el.hide();				
			}
		}
	},
});

App.Views.AltenrativeListSpeedButtons = Backbone.Marionette.View.extend({
	events : {
		'click div#newAlternative' : 'newAlternative',
		'click div#reuseAlternative' : 'reuseAlternative',
	},
	initialize : function(){
		_(this).bindAll();
	},
	render : function(){
		h="";
		h+="<div class='button green' id='newAlternative'>New Alternative</div>";
		//h+="<div class='button green' id='reuseAlternative'>Reuse Alternative</div>";
		this.$el.html(h);
		//this.delegateEvents();
	},
	newAlternative : function(){
		this.collection.create(null,{wait: false});
		jQuery(this.el).oneTime(1200,'some_focus',function(){jQuery("div.editable#name")[0].focus()});
	},
	reuseAlternative: function(){
		//alert('to be implemented');
		location.hash = "/projects"+this.model.id+"/reuseIssues";
	}
})

App.Views.DecisionItemView = Backbone.Marionette.CompositeView.extend({
	template: "#DecisionItemViewTemplate",
	tagName: 'tr',
	className : 'decision',
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
    },
    initialize : function(){
    	_(this).bindAll();
    	eventer.register(this);
    },
    onRender : function(){
    	jQuery(this.el).addClass(this.model.get('color'));
    },
    notifyEvent : function (data){
	  	d = JSON.parse(data)
	  	if( d.id == this.model.id){
	  			this.render();
	  	}
    },
});

App.Views.DecisionListWidget = Backbone.Marionette.CompositeView.extend({
	template: '#DecisionListWidgetTemplate',
	itemView: App.Views.DecisionItemView,
	initialize : function(){
		_(this).bindAll();
		// i assume here that it got model as a parameter
		this.collection = new Backbone.Collection();
		this.regenerateCollection();
		this.model.on('change',this.regenerateCollection,this);
	},
	regenerateCollection : function(){
		var newModels = []
		_(this.model.get('decisions')).each(function(decisionType){
			_(decisionType.details).each( function( userDecision ){
				
				// if this decision already is on the list (rationale changed.)
				if( this.collection.get( userDecision.decision_id )){
					var decisionModel = this.collection.get( userDecision.decision_id );
					decisionModel.set('rationale',userDecision.Rationale);
				}

				var decisionModel = new Backbone.Model();
				decisionModel.set('id',userDecision.decision_id);
				decisionModel.set('user',userDecision.email);
				decisionModel.set('userId',userDecision.user_id);
				decisionModel.set('timestamp',userDecision.timestamp);
				decisionModel.set('type',decisionType.name);
				decisionModel.set('color',decisionType.color);
				decisionModel.set('rationale',userDecision.Rationale);
				newModels.push( decisionModel );

			},this);
		},this);
		this.collection.reset( newModels );
	},
	appendHtml : function( collectionView, itemView, index ) {
		//collectionView.$el.prepend(itemView.el);
		jQuery("table.decisionListWidget",collectionView.el).append(itemView.el);
	},
});

App.Views.RationaleWidget = Backbone.Marionette.ItemView.extend({
  template: '#RationaleWidgetTemplate',
  templateHelpers: {
    get : function( id ){
        if( this[id] ){
            return(this[id]);
        }
        else{
            return("(empty)");
        }
    },
  },
  events: {
  	"click a.btn#save": 	'save',
  },
  initialize : function(){
    _(this).bindAll();
    this.model.on('change',this.render,this);
  },
  beforeRender : function(){
  	if( this.model.get('your_decision').tagging_id == null ){
  		this.template = "#RationaleWidgetTemplateSpinner"
  	}
  	else{
  		this.template = '#RationaleWidgetTemplate'
  	}
  },
  onRender : function(){

  	if( jQuery("div#rationaleText",this.el)[0] ) {
	  	this.ne = new nicEditor({iconsPath : '/images/nicEditorIcons.gif', buttonList : ['bold','italic','underline','strikeThrough','ol','ul','link','unlink'],hasPanel:true});
		this.ne.panelInstance(jQuery("div#rationaleText",this.el)[0]);
		
		// no idea why do I need this...
		// without it editor renders wrong....
		jQuery("div",jQuery("div#rationaleText",this.el).parent()).eq(0)[0].style['width']="100%";

		// this sets focus where it should be. 
		jQuery(this.el).oneTime(300,'some_focus',function(){jQuery("div#rationaleText")[0].focus()});
	}
  },
  save : function(){
    jQuery.ajax({
	 	type: 'PUT',
	 	url: '/r/'+this.model.get('your_decision').tagging_id+'/Rationale',
	 	data: jQuery("div#rationaleText",this.el).html(),   
	 	complete: function(){
			layout.modal.close(); 		
	 	}
	 });      	  		
  },
});

