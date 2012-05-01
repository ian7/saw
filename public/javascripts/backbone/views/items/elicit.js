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
  	"click .name"	: "navigateToItem",
    "click .expand" : "expand",

	/*"click .expand" : "toggleExpand",
	"click .deleteItem" : "deleteItem",
	"keypress .e6" : "editedItem",
	"click .e6" : "expand",
	"click .e6" : "selectAll",
	"click .details" : "navigateToDetails",
	*/
  },

  initialize : function(options) {
	_(this).bindAll('notify','showElicit','showUnElicit','doUnElicit','doElicit','expand');
	notifier.register( this );
  },

  render : function() {

      h = "<b>Issue:</b> <span class='name'>" + this.model.attributes.name + "</span> ";
      h += "<div class='button orange expand' style='float: right'>Expand</div>";
      h += "<div class='itemExtendedAttributes'>";

      h += "<table class='itemAttributes'>";


      _(this.model.attributes).each(function(v,a){
        if( a != "id" &&
            a != "name" &&
            a != "item_url" &&
            a != "type" &&
            a != "tags"
            ){
          h += "<tr>";
            h += "<td class='attributeName'>" + a + ": </td>"
            h += "<td class='attributeValue'>";
            if( v != null){
              h += v;
            }
            else {
              h += "<i>(empty)</i>";
            }
            h += "</td>";   
          h += "</tr>";
          }
      },this);

      h += "</table>";
      h += "<b>Tags:</b>";

      h += "<table class='itemAttributes'>";


      _(this.model.attributes.tags).each(function(v,a){
          h += "<tr>";
            h += "<td class='attributeName'>" + v.type + ": </td>"
            h += "<td class='attributeValue'>" + v.name + "</td>";   
          h += "</tr>";
      },this);

      h += "</table>";

      h += "</div>";
    	this.el.innerHTML = h;
   return this;

  },
  expand : function(){
    d = jQuery("div.itemExtendedAttributes",this.el);

    if( d.is(':visible') ){
      d.hide();
    }
    else{
      d.show();
    }
  },
  showElicit : function(){
    this.render();
  	jQuery(this.el).prepend("<div class='button white unelicit' style='float: right'>Remove</div>");
  },
  showUnElicit : function(){
  	this.render();
    jQuery(this.el).prepend("<div class='button black doelicit' style='float: right'>Elicit</div>");
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
  },

});


App.Views.Items.ElicitCollection = Backbone.View.extend({
  events : {
//	"click .expandAll" : "expandAll",
//	"click .collapseAll" : "collapseAll",
	"click .project" : "project",
  "click ul.tagType li" : "tagTypeSelected",
  "click ul.tagName li" : "tagNameSelected",
  "keyup div.filter" : "filter",
  "click div.filter"    : "clickFilter",
  "click div.clearFilter": "clearFilter",

  },

  newItemName : '(new item)',

  initialize : function() {

  _(this).bindAll('renderTagList','tagTypeSelected','tagNameSelected');
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
	    childViewClassName   : 'elicitItemList'
    });

	this.render();
	notifier.register(this);

  },
 
  render : function() {			
		this._rendered = true;
		//this.el.innerHTML="haha";
		
    this.el.innerHTML = "<table width='100%'>"
            + "<tr><td class='issues' width/><td class='tags'><div class='tags'/></td></tr>"
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
    li = "";

    tagsHash = {}
    typesHash = {};

    this.all_collection.each( function( issue ) {
      issueTags = issue.get('tags');
      _(issueTags).each(function( tag ){

        // we should register new tag only if we don't have one yet.
        if( tagsHash[tag.id] == null ) {

          tagsHash[tag.id] = {"name": tag.name, "type": tag.type, "id": tag.id };
          
          if( typesHash[ tag.type ] == null ){
            typesHash[tag.type] = 1;
          }
          else{
            typesHash[tag.type] = typesHash[tag.type] + 1;
          }
        }
      },this);
    },this);

    li += "<div class='textSearch'>";
    li += "<b>Search for:</b> <div class='filter' contenteditable='true'>(empty)</div>";
    li += "</div>";

    li +="<div class='button white clearFilter' style='float: right'>Clear</div>";


    li += "<br><b>Select Tag:</b>";
    li += "<ul class='tagSelector tagType'>"

    //typesHash = _(typesHash).sortBy( function(c,t){ return t });

    _(typesHash).each(function(count,type){
      li += "<li id='"+type+"'>" + type + " ("+count+")";

      li += "<ul class='tagSelector tagName'>"

      tagsHash = _(tagsHash).sortBy(function(t){return t.name});

      _(tagsHash).each(function(tag,id){
        if( tag.type == type ){
          li += "<li class='tagName' id='" + tag.id + "'>" + tag.name + "</li>";
        }
      },this);

      li += "</ul></li>";

    },this);

    li += "</ul>";
    this.tagListEl.append(li);
  },
  tagTypeSelected : function( e ){
    // this toggles visibility of tag-instances
    subList = jQuery(e.srcElement.children[0]);
    if( subList.is(':visible') ){
      subList.hide();
    }
    else{
      subList.show();
    }
  },

  tagNameSelected : function( e ){
    id = e.srcElement.id;
    // mark all other elements black
    jQuery("li.tagName",this.el).removeClass("red");
    // mark this one red
    jQuery(e.srcElement).addClass("red");

    _(this.all_collection.models).each( function( itemModel ){
      found = false;
      // iterate over tags attached
      _(itemModel.get('tags')).each( function( tag ){
        if( tag.id == id ){
          found = true;
        }
      },this);
      if( found ){
        jQuery(itemModel.view.el).show();
      }
      else{
        jQuery(itemModel.view.el).hide();
      }
    },this);
  },
  filter : function(e){
    // mark all other elements black
    jQuery("li.tagName",this.el).removeClass("red");

    newFilter = e.srcElement.innerText;
    this._itemsCollectionView.filter(newFilter);
  },
  clickFilter : function(e){
      document.execCommand('selectAll',false,null);
  },
  clearFilter : function(){
    // mark all other elements black
    jQuery("li.tagName",this.el).removeClass("red");
    jQuery("div.filter",this.el).innerHTML="(empty)";
    this._itemsCollectionView.filter("");
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
          jQuery(childView.el).show();
      });
    }
    else{
      _(this._childViews).each( function( childView ){
          if( childView.model.attributes.name.search( new RegExp(term, "i") ) >= 0){
            jQuery(childView.el).show();
          }
          else {
            jQuery(childView.el).hide();
          }
      });
    }
  }
});

