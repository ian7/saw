/**
 * @author Marcin Nowak
 */
var Alternative = Backbone.Model.extend({
    url : function() {
      var base = '/alternatives';
      

      if( this.collection ) {
	    if (this.isNew())  {
			return this.collection.item_url+base;
		}
		else {
      		return( this.collection.item_url+base+'/'+this.id);
		}
      }
      else {
	    if (this.isNew()) {
			return base;
		}
		else {	
      		return(base + '/' + this.id);
		}
      }
    },
/********** status and metrics stuff comes here ******************/
	decisionsTotal : function() {
		
	},
	decisionsSummary : function() {
		
	},
});


var Alternatives = Backbone.Collection.extend({
  model : Alternative,
  url : window.location.pathname+"/alternatives",
  
});

/**
 * @author Marcin Nowak
 */



var Item = Backbone.Model.extend({
    url : function() {
		var base = "";
		// in case there is a collection attached to this item
		// we do some (evil) url arthmetics 
		if( this.collection ) {
			base = this.collection.url();
		}
		else {
		  // otherwise we do even more evil location arthmetics
	      base = window.location.pathname;
		}
		if (this.isNew()) 
			return base;

	    return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id; 
	}
});


var Items = Backbone.Collection.extend({
  model : Item,
  url : function() {
	if( !this.urlOverride ) {
		return window.location.pathname;
	}
	else {
		return this.urlOverride;
	}
	},
  urlOverride : null
});


/**
 * @author Marcin Nowak
 */
var Tag = Backbone.Model.extend({
    url : function() {
      var base = 'tags';
      if (this.isNew()) return base;
      return '/items/' + this.id + '/tag/tags_list';
    }
});


var Tags = Backbone.Collection.extend({
  model : Tag,
  url : "/tags"
});
/**
 * @author Marcin Nowak
 */

var Taggable = Backbone.Model.extend({
    url : function() {
      var base = 'items';
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
    }
});
/**
 * @author Marcin Nowak
 * I'm going to come back to it later.
 */
App.Controllers.Alternatives = Backbone.Controller.extend({
    routes: {
    	//new Regexp('^([^\/]*)/.*$'): 'show',
    	//new Regexp('^[^\/]*/([^\/]*)\/.*$': 'show',
        "/:id":            "show",
        "":                         "index",
        "new":                      "newDoc"
    },
    
    show: function(id) {
    	this.item_id = id;
        var item = new Item({ id: id });
        item.fetch({
            success: function(model, resp) {
                new App.Views.Show({ item: item });
            },
            error: function() {
                new Error({ message: 'Could not find that document.' });
                window.location.hash = '#';
            }
        });
    },
    
    index: function() {
        jQuery.getJSON('/items', function(data) {
            if(data) {
                var items = _(data).map(function(i) { return new Item(i); });
                new App.Views.Index({ items: items });
            } else {
                new Error({ message: "Error loading documents." });
            }
        });
    },
    
    newDoc: function() {
        new App.Views.Edit({ model: new Document() });
    },
});



/**
 * @author Marcin Nowak
 */
App.Controllers.Items = Backbone.Controller.extend({
    routes: {
    	//new Regexp('^([^\/]*)/.*$'): 'show',
    	//new Regexp('^[^\/]*/([^\/]*)\/.*$': 'show',
        "/:id":            "show",
        "":                         "index",
        "new":                      "newDoc",
//		"/:id/addTag": "addTag", 
    },
	initialize : function() {

	},
	cleanUp : function() {
		if( this.view ) {
			this.view.el.innerHTML = "";
			delete this.view;
			this.view = null;
		}
	},
    show: function(id) {
		this.cleanUp();
		
		// id for the item 
		this.item = new Item({ el: 'section.itemList'});
        this.view = new App.Views.Show({ model: this.item, el: 'section.itemList'});     

		this.item.id = id;
        this.item.fetch({
            success: function(model, resp) {
//				el = jQuery("section.itemList");
            },
            error: function() {
                new Error({ message: 'Could not find that document.' });
                window.location.hash = '#';
            }
        });

    },
	  
    index: function() {
		this.cleanUp();
		this.items_collection = new Items;	
		this.view = new App.Views.Index({collection: this.items_collection, el: 'section.itemList'});						

		this.items_collection.fetch({
			success: function(model, resp) {
			}
		});
    },
    
    newDoc: function() {
        //new App.Views.Edit({ model: new Document() });
    },
    update: function( broadcasted_id ) {	
	    	//if( App.Components.Items.view ) {
	    	//	App.Components.Items.view.trigger('update',broadcasted_id);
	    	//}
	    	
	
	
	    	var c = App.Components.Items;
	    	
	    	if( broadcasted_id == this.item_id ) {
	    		this.refresh();
	    	}
	    	
	    	if( c.alternatives && c.alternatives.alternatives ) {
	    		//_.each(c.alternatives.alternatives)
	    		_(c.alternatives.alternatives).each(function(a) {
	    			if( a.id == broadcasted_id ) {
	    				//alert( a.id );
	    				a = new Alternative({id: broadcasted_id });
	    				a.item_id = c.item_id
	    				a.fetch({
	    					success: function( model, resp) {
			    				o = JST.alternatives_show({ a: a });
			    				e = jQuery("#"+broadcasted_id);
			    				e.html( o );

   					           jQuery('.alternativeEdit'+broadcasted_id).each( function(i){
						       	  jQuery(this).attr('contenteditable','true');
						       	  jQuery(this).keypress( function() {
						       	  	jQuery(this).stopTime("edit5")
						       	  	jQuery(this).oneTime(1000,"edit5", function() {
								         jQuery.ajax({
								         	type: 'PUT',
								         	url: '/items/'+jQuery(this).parent().parent().attr('id'),
								         	data: jQuery(this).attr('id')+'='+jQuery(this).html()   	 
								         });       	  		
						       	  	});
						       	  });	               	  	
						       	 });     

		    					}
	    				});
	    			}
	    		});
	    	}
	    	// if we're displaying something then let's broadcast update !		    	
	    	    	
    },
    refresh: function() {
    	this.show( this.item_id );
    },
    addTag: function() {
    	// logic comes here !
        jQuery.getJSON('/items/'+this.item_id+'/tag/list', function(data) {
            if(data) {
                var tags = _(data).map(function(i) { return new Tag(i); });
                this.tags = new App.Views.Tags.Add({ el: tata, tags: tags });
            } else {
                new Error({ message: "Error loading tags to add." });
            }
    	});
    },
    
    tag: function( tag_id ) {
        jQuery.getJSON(this.model.item_url+'/tag/dotag?from_taggable_id='+tag_id, function(data) {
	    	// so let's update it !'
   	    	//App.controller.update();
    		});
    },
    unTag: function( tagging_id ) {
        jQuery.getJSON(this.item_url+'/tag/untag?tagging_id='+tagging_id, function(data) {
	    	// so let's update it !'
   	    	//App.controller.update();
    		});    		
    },
    newAlternative: function() {
        jQuery.getJSON('/items/'+this.item_id+'/alternatives/new', function(data) {
	    	// so let's update it !'
   	    	//App.controller.update();
    		});    		    	
    },
    expandAlternatives: function( item_id ){
        jQuery.getJSON('/items'+item_id+'/alternatives', function(data) {
        	if(data){
        		jQuery('#'+item_id).html = JST.alternatives_list_list()
        	}
        });
    }
});



/**
 * @author Marcin Nowak
 */
App.Controllers.Project = Backbone.Controller.extend({
    routes: {
        "" : "index",
    },

	initialize : function(){
		// this nicely finds project id
		if( window.location.pathname.match('projects') ) {
			this.projectid = window.location.pathname.match('projects\/.*$')[0].substring(9,33);
		}		
		this.items_collection = new Items;
		this.items_collection.urlOverride = window.location.pathname+'/items';
		this.itemsView = new App.Views.Items.ProjectIndex({collection: this.items_collection, el: 'section.itemList'});						
	},
    index: function() {  		
		this.items_collection.fetch({
			success: function(model, resp) {
				// this fails because of missing context
				// let's try it with events
//				alert('yeah');
			}
		});
		
    },

});



/**
 * @author Marcin Nowak
 */
App.Controllers.Tags = Backbone.Controller.extend({
    routes: {
    //    "add": 	 "add",
    //  "":      "index",
    //  "delete":"newDoc"
    },
    
    list: function(id) {
        var tags = new Tag({ id: id });

        jQuery.getJSON('/items/'+this.item.id+'/tag/tags_list', function(data) {
	    if(data) {
            	var tags = _(data).map(function(i) { return new Tag(i); });
                new App.Views.Tags.List({ el:tata, tags: tags });
            }
        });
    },
    
    index: function() {
        jQuery.getJSON('/items.json', function(data) {
            if(data) {
                var items = _(data).map(function(i) { return new Item(i); });
                new App.Views.Index({ items: items });
            } else {
                new Error({ message: "Error loading documents." });
            }
        });
    },
    
    newDoc: function() {
        new App.Views.Edit({ model: new Document() });
    }
});


var UpdatingCollectionView = Backbone.View.extend({
  initialize : function(options) {
    _(this).bindAll('add', 'remove');
 
    if (!options.childViewConstructor) throw "no child view constructor provided";
    if (!options.childViewTagName) throw "no child view tag name provided";
 
    this._childViewConstructor = options.childViewConstructor;
    this._childViewTagName = options.childViewTagName;
    this._childViewClassName = options.childViewClassName;
    this._childViews = [];
 
    this.collection.each(this.add);
 
    this.collection.bind('add', this.add);
    this.collection.bind('remove', this.remove);
  },
 
  add : function(model) {
	
	// this allows only one view for the given model to be displayed in the widget, so if it finds view with given id
	// it simply ignores it.
/*	var existingViewForModel = _(this._childViews).select(function(cv) { return cv.model.id == model.id; })[0];
	if( existingViewForModel ){
		return;
	}
	*/
	
    var childView = new this._childViewConstructor({
      tagName : this._childViewTagName,
      className : this._childViewClassName,
      model : model
    });

 	model.view = childView;
    this._childViews.push(childView);
 
    if (this._rendered) {
      $(this.el).append(childView.render().el);
    }
  },
 
  remove : function(model) {
    var viewToRemove = _(this._childViews).select(function(cv) { return cv.model === model; })[0];
    this._childViews = _(this._childViews).without(viewToRemove);
 
    if (this._rendered) $(viewToRemove.el).remove();
	// some cleanup !
	notifier.unregister(viewToRemove);
	delete viewToRemove;
//	alert("!");

  },
 
  render : function() {
    var that = this;
    this._rendered = true;
 
    $(this.el).empty();
 
    _(this._childViews).each(function(childView) {
      $(that.el).append(childView.render().el);
    });
 
    return this;
  }
});


AlternativeUpdatingView  = Backbone.View.extend({
	className : "decision", 
    events : {
		"keypress .name" 			: "editedName",
		"click .name"				: 'selectAll',
		"click .deleteAlternative"	: "deleteAlternative",
		"click .unrelateAlternative": "unrelateAlternative",
		"click .decide"				: "decide",
		"click .undecide"			: "undecide"
    },
    initialize: function() {
// WTF ?	    this.render = _.bind(this.render, this); 
		_(this).bindAll('render','decide','undecide');
	    this.model.bind('change', this.render);
		notifier.register(this);
    },
    
    render: function() {

	   this.el.innerHTML = JST.alternatives_show( {a: this.model} );

	   
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
		
	   return this;
    },
    // this updates single row in the table
    update: function( item_id ){
    		
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






AlternativeDetailsUpdatingView  = Backbone.View.extend({
	className : "alternativeList", 
    events : {
		"keypress .name" 			: "editedName",
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
		
	   return this;
    },
    // this updates single row in the table
    update: function( item_id ){
    		
    },
	editedName : function( e ) {
		// nasty but works.
	    //var lastEditedItem = this;

		if (e.keyCode == 13) {
			this.model.save(
				{ name: jQuery(".name",this.el).html() },
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






DecisionsUpdatingView  = Backbone.View.extend({
	className : "decision", 
    events : {
    },
    initialize: function() {

		_(this).bindAll('render');
	    this.model.bind('change', this.render);
//		notifier.register(this);
    },
    
    render: function() {

	
	   this.el.innerHTML = JST.decision_show( {a: this.model} );
	   
	
	 /*
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
	  */
	
	   return this;
    },

});



App.Views.Decisions.List = Backbone.View.extend({
  events : {
//	"click .newItem" : "newItem"
  },
  initialize : function() {
	this.alternativesCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : DecisionsUpdatingView,
      childViewTagName     : 'tr'
    });
	this.render();
//	notifier.register(this);

	this.collection.bind('refresh', this.checkNewAlternative);
  },
 
  render : function() {
		this.rendered = true;
		this.alternativesCollectionView.el = jQuery('table.decisionList', this.el);
		this.alternativesCollectionView.render();
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
});




/**
 * @author Marcin Nowak
 */

jQuery.fn.flash = function( color, duration )
{
	duration = 50000;
    var current = this.css( 'color' );

    this.animate( { color: 'rgb(' + color + ')' }, duration / 2 );
    this.animate( { color: current }, duration / 2 );

}

var ItemUpdatingView = Backbone.View.extend({
  events : {
	"click .expand" : "toggleExpand",
	"click .deleteItem" : "deleteItem",
	"keypress .e6" : "editedItem",
	"click .e6" : "expand",
	"click .e6" : "selectAll",
  },

  alternativesCollection : null,

  initialize : function(options) {
    this.render = _.bind(this.render, this); 
    this.model.bind('change', this.render);

	this.alternativesCollection = new Alternatives;
   
	this.alternativesCollection.issueView = this;
	this.isExpanded = false;

	// catch alternatives resource location hack
	this.alternativesCollection.item_url = window.location.pathname+"/"+this.model.get('id');
	this.alternativesCollection.url = window.location.pathname+"/"+this.model.get('id')+'/alternatives';
	
	this.alternativesCollectionView = new App.Views.Alternatives.List({ collection: this.alternativesCollection, el: this.el });
	_(this).bindAll('notify');
		
	notifier.register( this );
  },

  render : function() {

	this.alternativesCollection.item_url = window.location.pathname+"/"+this.model.get('id');
	this.alternativesCollection.url = window.location.pathname+"/"+this.model.get('id')+'/alternatives';

//	this.tempEL = document.createElement("tr");
//	this.tempEL.innerHTML = JST.items_index( {item: this.model} );

   this.el.innerHTML = JST.items_index( {item: this.model} );

//   this.alternativesCollectionView.render();

   if(  localStorage.getItem( this.model.get('id')+'expanded' ) == 'true' ) {
		this.expand();
	}
	
	// finally attach it ;)
//	this.el.innerHTML = this.tempEL.innerHTML;

   return this;
  },
  selectAll : function( e ){ 
	if( e.toElement.innerText == '(new item)') {
		document.execCommand('selectAll',false,null);
	}
	
  },
  editedItem : function( e ) {
     	// nasty but works.

		if (e.keyCode == 13) {
			var wasNew = this.model.isNew();
			var newValue = e.srcElement.innerHTML;

			if(newValue == "<br>") {
				newValue = '(empty)';
			}
			this.model.save(
				{ name: newValue },
				{ success : function( model, resp)  {

					// make it expand on refresh					
					if( wasNew ) {
						localStorage.setItem( model.get('id')+'expanded','true');
					}
					model.parse( resp );
					model.change();
				}
			});			
		}
		/* timed saving has proven to be not so very sexy
         *
		 *
   	  	jQuery(this.el).stopTime("edit5");
	  	jQuery(this.el).oneTime(000,"edit5", function() {
			lastEditedItem.model.save(
				{ name: jQuery("span.e6",this).html() },
				{ success : function( model, resp)  {
					model.parse( resp );
					model.change();
				}
			});	
		});	
		*/
  },
  deleteItem : function() {
		var viewObject = this;
 		jQuery(".deleteItem",this.el).fastConfirm({
           position: "left",
              questionText: "Are you sure ?",
              onProceed: function(trigger) {
					// remove confirmation
  	                $(trigger).fastConfirm('close');

					if( viewObject.model.collection ) {
						// remove it from the collection first
						viewObject.model.collection.remove( viewObject.model );
					}
					else {
						alert( 'not in the collection - fucker: ' + viewObject.model.get('name') );
					}
					// and then destroy it.
					viewObject.model.destroy();
               },
               onCancel: function(trigger) {
                       $(trigger).fastConfirm('close');
               }
            });	
  },
  doExpand : function() {
		if( this.isExpanded == false) {
			this.expand();
		}
  },
  toggleExpand: function(){
		if( this.isExpanded == false) {
			this.expand();
		}
		else {
			this.collapse();
		}
  },
  expand: function(){
			localStorage.setItem( this.model.get('id')+'expanded','true');
			
			this.isExpanded = true;
			jQuery(".expand", this.el).html("Collapse");

			this.alternativesCollectionView.render();
			
		   	// WTF ? new App.Views.Alternatives.List({ collection: this.alternativesCollection, el: this.el });
			this.alternativesCollection.fetch({ silent: false,
				success: function(model, resp) {
//					model.issueView.model.change();
					//model.issueView.alternativesCollection = model;
					// this can be executed somewhere else :)					
				}
			});
		
  },
  collapse: function(){
		localStorage.removeItem( this.model.get('id')+'expanded');
		this.isExpanded = false;
		jQuery("table.alternativeList", this.el).html("<!-- nothing -->");
		jQuery(".expand", this.el).html("Expand");	
  },
  notify : function( broadcasted_id ) {
		if( this.model.get('id') == broadcasted_id ) {
			this.alternativesCollection.fetch();
			jQuery(this.el).effect("highlight", {}, 50000);
		}
  }  

});

App.Views.Index = Backbone.View.extend({
  events : {
	"click .newItem" : "newItem",
	"click .expandAll" : "expandAll",
	"click .collapseAll" : "collapseAll",
//	"click .newItem" : 'checkNewItem',
  },

  newItemName : '(new item)',

  initialize : function() {

	_(this).bindAll('newItem','checkNewItem','removeNewItem','newItem');

	this.collection.bind('saved',this.checkNewItem );
	this.collection.bind('refresh',this.checkNewItem );
	
	this.collection.comparator = function( m ) { return m.get('id'); };

    // simply magic :)
    if( window.location.pathname.match('projects') ) {
		this.projectid = window.location.pathname.match('projects\/.*\/items')[0].substring(9,33);
	}

	this._itemsCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : ItemUpdatingView,
      childViewTagName     : 'p',
	  childViewClassName   : 'itemList'
    });



	this.render();
	notifier.register(this);

  },
 
  render : function() {			
		this._rendered = true;
		this.el.innerHTML="";
		this._itemsCollectionView.el = this.el; 
		this._itemsCollectionView.render();
		jQuery(this.el).prepend("<div class = 'button orange collapseAll'>Collapse all</div>");
		jQuery(this.el).prepend("<div class = 'button orange expandAll'>Expand all</div>");
//		jQuery(this.el).prepend("<div class = 'button red newItem'>New!</div>");
		this.checkNewItem();

  },
  removeNewItem : function() {
		this.collection.each( function( i ) {
			if( i.get('name') == '(new item)' ) {
				this.collection.remove( i );
				delete i;
			} 
		},this);
	
  },
  
  newItem : function() {
		var collection;

		if( this.collection ) {
			// we're called from the render method
			collection = this.collection; 
		}
		else {
			// we're called because collection element has been saved 
			collection = this;			
		}

/*		var preLastItem = collection.last();
		if( preLastItem.view ) {
			preLastItem.view.expand();
		}
*/
		
		i = new Item;

		// this.newItemName is unavailable when called by the 'save' event from the collection
		i.set({name: '(new item)' });
		collection.add( i );
		
  },
  notify : function( broadcasted_id ) {
/*		this.collection.each( function( i ) {	
			if( i.get('id') == broadcasted_id ) {
				i.fetch({
					success: function(model,resp) {
						model.change();
						jQuery(model.view.el).effect("highlight", {}, 500);
					}
				});
			}
		});
*/
		var thisView = this;
		
		if( this.projectid == broadcasted_id ) {
			this.collection.fetch({
				success: function(model, resp){
//					thisView.colllection
//					thisView.render();
				}
			});
		}
		
  },
  expandAll : function() {
	_.each(this._itemsCollectionView._childViews, function( childView ) {
		childView.expand();
	});
  },
  collapseAll : function() {
	_.each(this._itemsCollectionView._childViews, function( childView ) {
		childView.collapse();
	});
  },
  shortcut : function() {
	// alert("!");
  },
  checkNewItem : function() {
		this.removeNewItem();
		this.newItem();
  },
});



/**
 * @author Marcin Nowak
 */

App.Views.Items.ProjectItem = Backbone.View.extend({
  events : {
	},

  alternativesCollection : null,

  initialize : function(options) {

	_(this).bindAll('render','alternativesReady','notify');
	this.alternativesCollection = new Alternatives;
	
	this.alternativesCollection.issueView = this;
	// catch alternatives resource location hack
	this.alternativesCollection.item_url = this.model.url();
	this.alternativesCollection.url = this.model.url()+'/alternatives';

	this.alternativesCollection.bind('refresh',this.alternativesReady);
	
	// relate alternatives set to the model
	this.model.alternatives = this.alternativesCollection;

    this.render = _.bind(this.render, this); 
    this.model.bind('change', this.render);

	this.isExpanded = false;

	
//	this.alternativesCollectionView = new App.Views.Alternatives.List({ collection: this.alternativesCollection, el: this.el });
	_(this).bindAll('notify');
		
	notifier.register( this );
	this.alternativesCollection.fetch();
  },
  addStatus : function( message ) {
			jQuery("li.status",this.el).append("<li>"+ message+"</li>");
  },
  alternativesReady : function() {
	this.render();
  },
  render : function() {

   this.el.innerHTML = JST.project_show( {item: this.model} );

/* debug
   jQuery(this.el).prepend("<div class = 'button red render'>Render!</div>");
   jQuery(this.el).prepend("<div class = 'button red fetch'>Fetch!</div>");
*/
	if( this.alternativesCollection.length == 0 )
		this.addStatus("no alternatives")

   return this;
  },

  notify : function( broadcasted_id ) {
		if( this.model.get('id') == broadcasted_id ) {

			this.model.fetch();
			
			// deep refresh is required here to get decision arrays updated
			this.alternativesCollection.fetch({deepRefresh: true});
			jQuery(this.el).effect("highlight", {}, 500);	

		}
  }  

});

App.Views.Items.ProjectIndex = Backbone.View.extend({
  events : {
  },

  initialize : function() {


//	this.collection.bind('saved',this.checkNewItem );
//	this.collection.bind('refresh',this.checkNewItem );
	
	this.collection.comparator = function( m ) { return m.get('id'); };

    // simply magic :)
    if( window.location.pathname.match('projects') ) {
		this.projectid = window.location.pathname.match('projects\/.*$')[0].substring(9,33);
	}

	this._itemsCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : App.Views.Items.ProjectItem,
      childViewTagName     : 'p',
	  childViewClassName   : 'itemList'
    });



	this.render();
	notifier.register(this);

  },
 
  render : function() {			
		this._rendered = true;
		this._itemsCollectionView.el = this.el; 
		this._itemsCollectionView.render();
		
	//	jQuery(this.el).prepend("<div class = 'button orange collapseAll'>Collapse all</div>");
//		jQuery(this.el).prepend("<div class = 'button orange expandAll'>Expand all</div>");
//		jQuery(this.el).prepend("<div class = 'button red newItem'>New!</div>");
//		this.checkNewItem();
  },
  notify : function( broadcasted_id ) {
/*		this.collection.each( function( i ) {	
			if( i.get('id') == broadcasted_id ) {
				i.fetch({
					success: function(model,resp) {
						model.change();
						jQuery(model.view.el).effect("highlight", {}, 500);
					}
				});
			}
		});
*/
		var thisView = this;
		
		if( this.projectid == broadcasted_id ) {
			this.collection.fetch({
				success: function(model, resp){
//					thisView.colllection
//					thisView.render();
				}
			});
		}
		
  },
});



/**
 * @author Marcin Nowak
 */
 
//require('backbone/application');

App.Views.Show = Backbone.View.extend({
	events: {
		"click .addTag": "addTag", 
	},
    initialize: function() {
		//this.tagCollection = new Tags;
	_(this).bindAll('render');
			notifier.register(this);

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


		this.alternativesCollectionView = new App.Views.Alternatives.ListDetails({ collection: this.alternativesCollection, el: this.el });

		this.model.bind('change',this.render);
    },
    
    render: function() {
		this.alternativesCollection.item_url = this.model.url();
		this.alternativesCollection.url = this.model.url()+'/alternatives';

		this.alternativesCollection.fetch();

			this.el.innerHTML = JST.items_show({ item: this.model });
			this.tags = new Tags;
			this.tags.url = this.model.get('item_url')+'/tag/tags_list';
			this.tags.view = this;
			this.tags.fetch({
				success: function(model,resp) {
				  	new App.Views.Tags.List({collection: model, el: model.view.el });
				},
			});
        
	   // this handles in-place editing
       jQuery('.edit5').each( function(i){
       	  jQuery(this).attr('contenteditable','true');
       	  jQuery(this).keypress( function() {
       	  	jQuery(this).stopTime("edit5")
       	  	jQuery(this).oneTime(1000,"edit5", function() {
		         jQuery.ajax({
		         	type: 'PUT',
		         	url: '/items/'+item_id,
		         	data: jQuery(this).attr('id')+'='+jQuery(this).html()   	 
		         });       	  		
       	  	});
       	  });	               	  	
       	 });        
		this.alternativesCollectionView.render();

		return( this );
		// alternatives list

    },
	addTag: function(){
		this.tags = new Tags;
		this.tags.url = this.model.get('item_url')+'/tag/list';
		this.tags.view = this;
		
		this.tags.fetch({
			success: function( model, resp ){
				new App.Views.Tags.AddTag({ collection: model, el: model.view.el })
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
		}
	},
});





/**
 * @author Marcin Nowak
 */
 

TagAddView = Backbone.View.extend({
	events : {
		"click .doTag": "doTag", 
	},
    initialize: function() {
	    this.render = _.bind(this.render, this); 
	    this.model.bind('change', this.render);
        this.render();
    },
    
    render: function() {
       	out = JST.tags_add({tag: this.model });
        jQuery(this.el).html(out);

		return this;
    },
	doTag: function() {
		jQuery.getJSON(this.model.get('item_url')+'/tag/dotag?from_taggable_id='+this.model.get('id'), function(data) {
	   		});
	}
});


App.Views.Tags.AddTag = Backbone.View.extend({
  events : {
//	"click .newItem" : "newItem",
//	"keypress"		 : "shortcut"
  },
  initialize : function() {
	this.tagCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : TagAddView,
      childViewTagName     : 'tr'
    });
	this.render();
//	notifier.register(this);
//	this.collection.bind('saved',this.newItem)
  },
  render : function() {
		this._rendered = true;
		this.tagCollectionView.el = jQuery('table.tagList', this.el);
		this.tagCollectionView.render();
	//	this.newItem();
  },  
});

/**
 * @author Marcin Nowak
 */
 

TagView = Backbone.View.extend({
	events: {
		"click .unTag"	: 	"unTag", 
	},
    initialize: function() {
	    this.render = _.bind(this.render, this); 
	    this.model.bind('change', this.render);
//        this.render();
    },
    
    render: function() {
        this.el.innerHTML = JST.tags_list({tag: this.model });
			
//        jQuery(this.el).html(out);
	return this;
    },
	unTag : function() {
	 	jQuery.getJSON(this.model.get('item_url')+'/tag/untag?tagging_id='+this.model.get('tagging_id'), function(data) {
	    	// so let's update it !'
   	    	//App.controller.update();
    		});
//		alert(this.model.get('id'));
	}
});


App.Views.Tags.List = Backbone.View.extend({
  events : {
//	"click .newItem" : "newItem",
//	"keypress"		 : "shortcut"
  },
  initialize : function() {
	this.tagCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : TagView,
      childViewTagName     : 'tr'
    });
	this.render();
//	notifier.register(this);
//	this.collection.bind('saved',this.newItem)
  },
  render : function() {
		this._rendered = true;
		this.tagCollectionView.el = jQuery('table.tagList', this.el);
		this.tagCollectionView.render();
	//	this.newItem();
  },  
});
(function(){
window.JST = window.JST || {};
var template = function(str){var fn = new Function('obj', 'var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push(\''+str.replace(/[\r\t\n]/g, " ").replace(/'(?=[^%]*%>)/g,"\t").split("'").join("\\'").split("\t").join("'").replace(/<%=(.+?)%>/g,"',$1,'").split("<%").join("');").split("%>").join("p.push('")+"');}return p.join('');"); return fn;};
window.JST['alternatives_list'] = template('<div class="button orange" onclick="App.Components.Items.newAlternative()">add new</div><table>    <% _(alternatives).each(function(a) { %> 	   	<tr id="<%=a.attributes.id%>">		    <td>	    	 	<%=a.attributes.id%>	    	</td>	   		<td>	   			    		<b>Name:</b>	    		<span id="name" class="alternativeEdit<%=a.attributes.id%>"><% if(a.attributes.name) {%><%= a.attributes.name %><% } else { %>(empty)<% } %></i>		    </td>	    	<td>	    		<b onClick="App.controller.unTag(\'aa\');">UNRELATE</b>,	    	</td>	    	<td> 		    	Decide: <% _(a.attributes.decisions).each(function(decision) { %>		    		<b onClick="App.Helpers.Items.decide(\'<%=a.get(\'relation_url\')%>\',\'<%=decision.decision_tag_id%>\');"><%= decision.name.charAt(0) %>:</b> <%= decision.count %>, 		    	<% });%>	    	</td>	    </tr>    <% }); %></table>');
window.JST['alternatives_show'] = template('	   		<td>	   			    		<!-- <b>Name:</b> -->	    		<span class="name" contenteditable="true"><% if(a.get(\'name\')) {%><%= a.get(\'name\') %><% } else { %>(empty)<% } %></span>		    </td>	    	<td class="delete">				<% if( !a.isNew() ) {  %><!--					<div class="button gray unrelateAlternative">UnRelate</div> -->		    		<div class="button black deleteAlternative">Delete</div>				<% } %>	    	</td>	    	<td class="decisions"> 				<% if( !( a.attributes.your_decision && a.attributes.your_decision.name ) ) { %>				    	<% _(a.attributes.decisions).each(function(decision) { %>				    	<div class="button decide <%= decision.color.toLowerCase() %>" id="<%= decision.decision_tag_id %>"><%= decision.name %>(<%= decision.count %>)</div>					<% });%>				<% } else { %>		    		<% _(a.attributes.decisions).each(function(decision) { %>						<% if( decision.name == a.attributes.your_decision.name ) { %>		    				<div class="button undecide <%= decision.color.toLowerCase() %>" id="<%= decision.decision_tag_id %>">Revoke(<%= decision.count %>)</div>						<% } else { %>				    		<div class="button undecide gray" id="<%= decision.decision_tag_id %>"><%= decision.name %>(<%= decision.count %>)</div>						<% } %>					<% }); %><!--						<div class="button undecide <%= a.attributes.your_decision.color.toLowerCase() %>" id="<%= a.attributes.your_decision.decision_tag_id %>">Revoke</div> -->				<% } %>				<!-- here comes the insert -->				<table class="decisionList"></table>	    	</td>');
window.JST['alternatives_showDetails'] = template('	   		<td>	   			    		<!-- <b>Name:</b> -->	    		<span class="name" contenteditable="true"><% if(a.get(\'name\')) {%><%= a.get(\'name\') %><% } else { %>(empty)<% } %></span>		    </td>	    	<td class="delete">				<% if( !a.isNew() ) {  %><!--					<div class="button gray unrelateAlternative">UnRelate</div> -->		    		<div class="button black deleteAlternative">Delete</div>				<% } %>	    	</td>	    	<td class="decisions"> 				<% if( !( a.attributes.your_decision && a.attributes.your_decision.name ) ) { %>				    	<% _(a.attributes.decisions).each(function(decision) { %>				    	<div class="button decide <%= decision.color.toLowerCase() %>" id="<%= decision.decision_tag_id %>"><%= decision.name %>(<%= decision.count %>)</div>					<% });%>				<% } else { %>		    		<% _(a.attributes.decisions).each(function(decision) { %>						<% if( decision.name == a.attributes.your_decision.name ) { %>		    				<div class="button undecide <%= decision.color.toLowerCase() %>" id="<%= decision.decision_tag_id %>">Revoke(<%= decision.count %>)</div>						<% } else { %>				    		<div class="button undecide gray" id="<%= decision.decision_tag_id %>"><%= decision.name %>(<%= decision.count %>)</div>						<% } %>					<% }); %>				<% } %>				<!-- here comes the insert -->				<table class="decisionList">					 <!-- here we go over all decision types-->					 <% _(a.attributes.decisions).each( function(decision) { %>											<!-- here we enter single decisions -->						<% _(decision.details).each( function( detail ) { %>							<tr class="decision <%= decision.color.toLowerCase() %>">								<!--								<td class="id">									<%= detail.id %>								</td>								-->								<td class="user">									<%= detail.email %>								<td>								<!--								<td class="timestamp">									<%= detail.timestamp %>								<td>								-->							</tr>						<% }); %>											<% }); %>				</table>	    	</td>');
window.JST['items_index'] = template('    	<span class="e6" contenteditable="true"><%= item.get(\'name\') %></span>		<% if( !item.isNew() ) { %>			<a href=#/<%= item.get(\'id\')%>>details</a>,			<div style="float: right">		    	<div class="button gray expand">Expand</div> 		    	<div class="button black deleteItem">Delete</div>			</div>		<table class="alternativeList"></table>	   <% } %>');
window.JST['items_list'] = template('');
window.JST['items_show'] = template('<h3>	<a href=\'#\'>BACK !</a>	</h3><table><% _(item.attributes).each(function(value, key) { 	if (key.charAt(0) != \'_\' && key != "url" ) { %><tr><td>	<i><%= key %>: </i></td><td>	<span class="edit5" id="<%=key%>"><% if( value ) { %><%= value %><% } else { %>(empty)<% } %></span></td></tr><% }; });%></table><hr/><div class="button gray addTag">Add Tag</div><table class="tagList"/><table class="alternativeList"/>');
window.JST['project_show'] = template('	<span><b><%= item.get(\'name\') %></b></span>		<% if( item.alternatives )  { %>		Alternatives count: <%= item.alternatives.length %>,		<% var totalDecisions = 0; %>		<% var decisions = new Object; %>		<!-- here we iterate over alternatives -->		<% _(item.alternatives.models).each( function( alternative ) { %>			<!-- that iterates over decisions inside alternative -->			<% if( alternative.attributes.decisions ) { %>				<% _(alternative.attributes.decisions).each(function( decision ) { %>					<% totalDecisions = totalDecisions + decision.count; %>										<!-- just pre-set zero.. -->					<% if( ! decisions[ decision.name ] ) decisions[ decision.name ] = 0; %>										<!-- and now count them -->					<% decisions[ decision.name ] = decisions[ decision.name ] + decision.count; %>				<% }); %>			<% } %>		<% }); %>		Total decisions: <%= totalDecisions %>,			<% _( decisions ).each( function( count, decisionType ) { %>			<b><%= decisionType %></b>			<%= count %>		<% }); %>				<% delete decisions; %>	<% } %>		<% if( !item.isNew() ) { %>	<!--		<a href=#/<%= item.get(\'id\')%>>details</a>,			<div style="float: right">	    	<div class="button gray expand">Expand</div> 	    	<div class="button black deleteItem">Delete</div>		</div>		-->	<li class="status"></li>	<% } %>');
window.JST['tags_add'] = template('	<td>		Type: <b><%= tag.get(\'type\') %></b>, 	</td>	<td>	Name: <b><%= tag.get(\'name\') %></b>	</td>	<td>		<div class="button gray doTag">Tag</div>	</td>');
window.JST['tags_list'] = template('<tr>	<!--	<td>		<%=tag.get(\'tagging_id\') %>	</td>	-->    <td>		<!--<b>Type:</b>--> <b><%= tag.get(\'type\') %></b>	</td>	<td>		<!--<b>Name:</b>--> <%= tag.get(\'name\') %>   	</td>	<td>		<div class="button gray unTag">unTag</div>	</td></tr>');
})();