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

App.Views.Items.Elicit = Backbone.View.extend({
  events : {
  	"click .doelicit" : "doElicit",
  	"click .unelicit" : "doUnElicit",
  	"click .name"	: "navigateToItem"
	/*"click .expand" : "toggleExpand",
	"click .deleteItem" : "deleteItem",
	"keypress .e6" : "editedItem",
	"click .e6" : "expand",
	"click .e6" : "selectAll",
	"click .details" : "navigateToDetails",
	*/
  },

  initialize : function(options) {
/*    this.render = _.bind(this.render, this); 
    this.model.bind('change', this.render);

	this.alternativesCollection = new Alternatives;
   
	this.alternativesCollection.issueView = this;
	this.isExpanded = false;

	// catch alternatives resource location hack
	this.alternativesCollection.item_url = window.location.pathname+"/"+this.model.get('id');
	this.alternativesCollection.url = window.location.pathname+"/"+this.model.get('id')+'/alternatives';
	
	this.alternativesCollectionView = new App.Views.Alternatives.List({ collection: this.alternativesCollection, el: this.el });
*/		
	_(this).bindAll('notify','showElicit','showUnElicit','doUnElicit','doElicit');
	notifier.register( this );
  },

  render : function() {
/*
	this.alternativesCollection.item_url = window.location.pathname+"/"+this.model.get('id');
	this.alternativesCollection.url = window.location.pathname+"/"+this.model.get('id')+'/alternatives';

//	this.tempEL = document.createElement("tr");
//	this.tempEL.innerHTML = JST.items_index( {item: this.model} );

   this.el.innerHTML = JST.items_index( {item: this.model} );


   // nice localstorage status save
   if(  localStorage.getItem( this.model.get('id')+'expanded' ) == 'true' ) {
		this.expand();
	}

   jQuery(this.el).attr('id',this.model.get('id'));
   //
*/
	this.el.innerHTML = this.model.attributes.name;
   return this;

  },
  showElicit : function(){
  	this.el.innerHTML = "<b>Issue:</b> <span class='name'>" + this.model.attributes.name + "</span> " + 
  		"<div class='button white unelicit' style='float: right'>Remove</div>";
  },
  showUnElicit : function(){
  	this.el.innerHTML = "<b>Issue:</b> <span class='name'>" + this.model.attributes.name + "</span> " +
  	  "<div class='button black doelicit' style='float: right'>Elicit</div>";
  },
  doElicit : function(){
		jQuery.getJSON( this.model.get('item_url') + '/tag/dotag?from_taggable_id='+this.projectid, function(data) {});
  },
  doUnElicit : function() {
		jQuery.getJSON( this.model.get('item_url') + '/tag/untag?from_taggable_id='+this.projectid, function(data) {});
  },
  navigateToItem : function(){
		window.location.href = window.location.href.match(".*#")+'/'+this.model.id+'/details';
  },
  notify : function( broadcasted_id ) {
		/*if( this.model.get('id') == broadcasted_id ) {
			this.alternativesCollection.fetch();
			jQuery(this.el).effect("highlight", {}, 50000);
		}*/
  }  

});


App.Views.Items.ElicitCollection = Backbone.View.extend({
  events : {
//	"click .expandAll" : "expandAll",
//	"click .collapseAll" : "collapseAll",
	"click .project" : "project",
  },

  newItemName : '(new item)',

  initialize : function() {

  _(this).bindAll('renderTagList');
	/*_(this).bindAll('newItem','checkNewItem','removeNewItem','newItem');

	this.collection.bind('saved',this.checkNewItem );
	this.collection.bind('refresh',this.checkNewItem );
	*/

	this.all_collection = this.options.all_collection;
  this.all_collection.on("all", this.renderTagList,this );

	this.collection.comparator = function( m ) { return m.get('id'); };

    // simply magic :)
	// totally ugly magic...
    if( window.location.pathname.match('projects') ) {
		this.projectid = window.location.pathname.match('projects\/.*\/items')[0].substring(9,33);
	}

	this._itemsCollectionView = new App.Views.Items.ElicitUpdatingCollectionView({
      all_collection           : this.all_collection,
      collection  			   : this.collection, 
      childViewConstructor : App.Views.Items.Elicit,
      childViewTagName     : 'p',
	    childViewClassName   : 'itemList'
    });

	this.render();
	notifier.register(this);

  },
 
  render : function() {			
		this._rendered = true;
		//this.el.innerHTML="haha";
		
    this.el.innerHTML = "<table>"
            + "<tr><td class='issues'/><td class='tags'><div class='tags'/></td></tr>"
            + "</table>";
		
		this._itemsCollectionView.el = jQuery("td.issues",this.el); 		
    this.tagListEl = jQuery("div.tags",this.el);

		this._itemsCollectionView.render();
		//jQuery(this.el).prepend("<div class = 'button orange expandAll'>Expand all</div><div class = 'button orange collapseAll'>Collapse all</div>");


		buttons = "<p><b>Elicit design issues for your project:</b>" 
				+ "<div style='float: right'>"
				+ "<div class = 'button orange project'>Project Issues</div>" 
			/*  + "Filters: "
				+ "<div class = 'button orange expandAll'>Elicited</div>" 
				+ "<div class = 'button orange collapseAll'>Free</div>"
			*/	+ "</div><br/><br/></p>"
/*				+ "<div class = 'button black export' id='rtf'>Export RTF</div>"
				+ "<div class = 'button black export' id='rtf'>Export JSON</div>"
				+ "<div class = 'button black export' id='rtf'>Import JSON</div>";
				*/
		jQuery(this.el).prepend(buttons);





//		jQuery(this.el).prepend("<div class = 'button red newItem'>New!</div>");
//		this.checkNewItem();

  },
  renderTagList : function(){

    this.tagListEl.empty();

    tagsHash = {}

    this.all_collection.each( function( issue ) {
      issueTags = issue.get('tags');
      _(issueTags).each(function( tag ){
        tagsHash[tag.id] = {"name": tag.name, "type": tag.type};
      },this);
    },this);

    // render mf-ckers
    _(tagsHash).each(function(tag,id){
      
      this.tagListEl.append("<li>"+tag.type + " : "+tag.name+"</li>");
    },this);

    this.tagListEl.append("</ul>");
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
			this.collection.fetch();
		}
		
  },
  project : function() {
		window.location.href = window.location.href.match(".*(?=#)")
  },
});



App.Views.Items.ElicitUpdatingCollectionView = Backbone.View.extend({
  initialize : function(options) {
    _(this).bindAll('add', 'remove','sieveAdd','sieveRemove','sieve');
 
    if (!options.childViewConstructor) throw "no child view constructor provided";
    if (!options.childViewTagName) throw "no child view tag name provided";
 
    this._childViewConstructor = options.childViewConstructor;
    this._childViewTagName = options.childViewTagName;
    this._childViewClassName = options.childViewClassName;
    this._childViews = [];
 
 	this.all_collection = this.options.all_collection;
    this.all_collection.each(this.add);
 
    this.all_collection.bind('add', this.add);
    this.all_collection.bind('remove', this.remove);

    this.collection.each(this.sieveAdd);
    this.collection.bind('add', this.sieveAdd);
    this.collection.bind('remove', this.sieveRemove);

     if( window.location.pathname.match('projects') ) {
		this.projectid = window.location.pathname.match('projects\/.*\/items')[0].substring(9,33);
	}
  },
  sieveAdd : function(model){
  	/*_(this._childViews).each( function(view){
  		if(view.model.id == model.id ){
  			view.el.innerHTML = "hit";
  		}
  	},this);*/
	this.sieve();
  },
  sieveRemove : function(model){
  	/*_(this._childViews).each( function(view){
  		if(view.model.id == model.id ){
  			view.el.innerHTML = "not";
  		}
  	},this);*/
	this.sieve();
  },
  sieve : function(){
  	_(this._childViews).each( function( view ){
  		var found = false;
  		_(this.collection.models).each( function( sieveModel ){
  			if( view.model.id == sieveModel.id )
  				found = true;
  		},this);
  		if( found ){
  			view.showElicit();
  		}
  		else{
  			view.showUnElicit();
  		}
  	},this);
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
 	childView.projectid = this.projectid;

    this._childViews.push(childView);
 
    if (this._rendered) {
      $(this.el).append(childView.render().el);
    }
    this.sieve();
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
  },
  filter : function( term ){
    if( term.length == 0 ){
      _(this._childViews).each( function( childView ){
          childView.show();
      });
    }
    else{
      _(this._childViews).each( function( childView ){
          if( childView.model.attributes.name.search( new RegExp(term, "i") ) >= 0){
            childView.show();
          }
          else {
            childView.hide();
          }
      });
    }
  }
});

