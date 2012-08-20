/**
 * @author Marcin Nowak
 */

App.Views.ReuseIssuesItemView = Backbone.Marionette.ItemView.extend({
  className: 'reuseItem',
  tagName: 'tr',
  initialize : function(){
    _(this).bindAll();
    this.matchedIssues = this.model.collection.matchedIssues;
//    this.collection.matchedIssues.on('add',this.updateMatched,this);
//    this.collection.matchedIssues.on('remove',this.updateMatched,this);
    this.matchedIssues.on('reset',this.updateMatched,this);
    this.alternatives = new Alternatives();
    this.alternatives.urlOverride = "/items/"+this.model.id+"/alternatives"
    this.alternatives.on('reset',this.renderAlternatives,this);
  },
  events : {
    "click .elicit#reuse" : "doElicit",
    "click .elicit#remove" : "doUnElicit",
    "click .name" : "navigateToItem",
    "click .expand" : "expand",
  },
  updateMatched : function(){
      var inProject = false;
      for( matchedIssueId in this.matchedIssues.models ){
        var matchedIssue = this.matchedIssues.models[ matchedIssueId ];

        // this actually means that we found one...
        if( this.model.id == matchedIssue.id ){
          inProject = true;
        }
      }
      this.setReuse( inProject );
  },
  render : function(){

      var h = "<td>"
      h += "<div class='buttons'>"
      h += "<div class='button orange expand' style='float: right'>Expand</div>";
      h += "<div class='button black elicit'>(...)</div>";
      h += "</div>"
      h += "<b>Issue name:</b> <span class='name'>" + this.model.attributes.name + "</span> ";
      h += "<div class='itemExtendedAttributes'>";
      h += "<table class='itemAttributes'>";
      for( a in this.model.attributes ) {
        var v = this.model.attributes[a];

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
      }

      h += "</table>";
      h += "<b>Tags:</b>";

      h += "<table class='itemAttributes'>";

      for( a in this.model.attributes.tags ){
        var v = this.model.attributes.tags[a];
          h += "<tr>";
            h += "<td class='attributeName'>" + v.type + ": </td>"
            h += "<td class='attributeValue'>" + v.name + "</td>";   
          h += "</tr>";
      }

      h += "</table>";

      h += "<b>Alternatives:</b>";
      h += "<table class='itemAttributes alternativesAttributes' >";
      h += "</table>"

      h += "</td></tr>";
      this.el.innerHTML = h;
      this.updateMatched();
   return this;

  },
  renderAlternatives : function(){
    e = jQuery("table.alternativesAttributes",this.el);
    e.html("");
    _(this.alternatives.models).each( function( alternative ){
      row = "<tr>";
      row += "<td>"+alternative.get('name')+"</td>";
      row += "</tr>";
      e.append(row);
    },this);
  },
  expand : function(){
    d = jQuery("div.itemExtendedAttributes",this.el);

    if( d.is(':visible') ){
      //d.hide();
      d.slideUp(300);
      jQuery(".expand",this.el)[0].innerText="Expand";
    }
    else{
      //d.show();
      d.slideDown();
      this.alternatives.fetch();
      jQuery(".expand",this.el)[0].innerText="Collapse";
    }
  },
  setReuse : function( value ){
    this.reused = value;
    if( this.reused ){
      this.showUnElicit();
    }
    else{
      this.showElicit();
    }
  },
  showElicit : function(){
    //this.render();
    //jQuery(this.el).prepend("<div class='button white unelicit' style='float: right'>Remove</div>");
    jQuery("div.elicit",this.el).attr('id','reuse').html("Use");
  },
  showUnElicit : function(){
//    this.render();
//    jQuery(this.el).prepend("");
    jQuery("div.elicit",this.el).attr('id','remove').html("Remove");
  },
  doElicit : function(){
    jQuery.getJSON( this.model.get('item_url') + '/tag/dotag?from_taggable_id='+this.matchedIssues.id, function(data) {});
  },
  doUnElicit : function() {
    jQuery.getJSON( this.model.get('item_url') + '/tag/untag?from_taggable_id='+this.matchedIssues.id, function(data) {});
  },
  navigateToItem : function(){
    window.location.href = window.location.href.match(".*#")+'/'+this.model.id+'/details';
  },
});



App.Views.Items.ReuseIssuesWidget = Backbone.Marionette.CompositeView.extend({
  itemView : App.Views.ReuseIssuesItemView,
  className : 'reuseProjectIssues',
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
  initialize : function() {
    _(this).bindAll();
	   eventer.register(this);

     this.model = new Backbone.Model();
     this.model.url = "/projects/"+this.id;
     this.model.fetch();

     this.matchedIssues = new Items();
     this.matchedIssues.id = this.id;
     this.matchedIssues.urlOverride = this.model.url + "/items";
     this.matchedIssues.fetch();

     this.collection = new Items();
     this.collection.urlOverride = "/items?with_tags=true";
     this.collection.matchedIssues = this.matchedIssues;
     this.collection.comparator = function( model ){ 
        if( model.get('name') ){
          return model.get('name').trim().toLowerCase();
        }
        else {
          return ""
        }
      }
     this.collection.on('reset',this.renderTagList,this);
     this.collection.on('reset',this.hideSpinner,this);
     this.collection.fetch();

     this.speedButtons = new App.Views.EllicitIssueSpeedButtons({mainView: this});
     layout.speedButtonsSidebar.show( this.speedButtons);
     this.on('close',this.onClose,this);
  },
  onClose : function() {
    layout.speedButtonsSidebar.close();
  },
  hideSpinner : function() {
    jQuery("div.spinner",this.el).hide();
  },
  render : function() {				
    this.el.innerHTML = "<div class='spinner'><img class='spinner' src='/images/spinner.gif'/></div>"
            + "<table class='reuseWidget'>"
            + "<tr><td class='issues'><table class='allIssues'></table></td>"
            + "<td class='tags'><div class='tags'/></td></tr>"
            + "</table>";
		
//		this.itemsCollectionView.el = jQuery("td.issues",this.el); 		
    this.tagListEl = jQuery("div.tags",this.el);

//		this.itemsCollectionView.render();
		//jQuery(this.el).prepend("<div class = 'button orange expandAll'>Expand all</div><div class = 'button orange collapseAll'>Collapse all</div>");


		buttons = "<div class='help'>In this dialog you can select design issues to be reused within the scope of the scope of this project." 
            + "You can inspect details of individual issues in <b>expanded</b> view. At any moment you can <b>remove</b> issue from the scope of the project."    
		jQuery(this.el).prepend(buttons);





//		jQuery(this.el).prepend("<div class = 'button red newItem'>New!</div>");
//		this.checkNewItem();

  },
    appendHtml: function(collectionView, itemView){
        jQuery(collectionView.$("table.allIssues")[0]).append(itemView.el);
    },

  renderTagList : function(){
    this.all_collection = this.collection;

    this.tagListEl.empty();
    li = "";

    tagsHash = {}
    typesHash = {};

    this.all_collection.each( function( issue ) {
      issueTags = issue.get('tags');
      _(issueTags).each(function( tag ){

        // we should register new tag only if we don't have one yet.
        if( tagsHash[tag.id] == null ) {

          tagsHash[tag.id] = {"name": tag.name, "type": tag.type, "id": tag.id, "count" : 1 };
          
          if( typesHash[ tag.type ] == null ){
            typesHash[tag.type] = 1;
          }
          else{
            typesHash[tag.type] = typesHash[tag.type] + 1;
          }
        }
        else{
          tagsHash[tag.id].count += 1;
        }
      },this);
    },this);

    li += "<div class='textSearch'>";
    li += "<b>Search for:</b> <div class='filter' contenteditable='true'>(empty)</div>";
    li += "</div>";

    li +="<div class='button white clearFilter' style='float: right'>Clear</div>";


    li += "<br><b>Select Tag:</b>";
    li += "<ul class='tagSelector tagType' id='tagList'>"

    //typesHash = _(typesHash).sortBy( function(c,t){ return t });

    _(typesHash).each(function(count,type){
      li += "<li id='"+type+"'>" + type + " ("+count+")";

      li += "<ul class='tagSelector tagName' id='"+type+"'>"

      tagsHash = _(tagsHash).sortBy(function(t){return t.name});

      _(tagsHash).each(function(tag,id){
        if( tag.type == type ){
          li += "<li class='tagName' id='" + tag.id + "'>" + tag.name + " (" + tag.count + ")</li>";
        }
      },this);

      li += "</ul></li>";

    },this);

    li += "</ul>";

/*
    li += "<br/><b>Cloud:</b><br/>";
    li += "<canvas width='300' height='300' id='myCanvas'>"
    li += "<ul id='sth'>";
    li += "<li><a href='http://www.google.com'>Google</a></li><li><a href='/fish'>Fish</a></li><li><a href='/chips'>Chips</a></li><li><a href='/salt'>Salt</a></li><li><a href='/vinegar'>Vinegar</a></li>";
    li += "<li><a href='http://www.google.com'>Google</a></li><li><a href='/fish'>Fish</a></li><li><a href='/chips'>Chips</a></li><li><a href='/salt'>Salt</a></li><li><a href='/vinegar'>Vinegar</a></li>";
    li += "</ul>";
    li += "</canvas>"
    */
    this.tagListEl.append(li);
    /*TagCanvas.Start('myCanvas','sth',{
            textColour: '#ff0000',
            outlineColour: '#ff00ff',
            reverse: true,
            depth: 0.8,
            maxSpeed: 0.05
    });
    //TagCanvas.Start('myCanvas','tagList');
    */
  },
  tagTypeSelected : function( e ){
    // this toggles visibility of tag-instances
    subList = jQuery(e.srcElement.children[0]);
    if( subList.is(':visible') ){
      subList.hide();
    }
    else{
      subList.show();
/*      debugger;
      TagCanvas.Start('myCanvas',e.srcElement.attributes.id.value,{
            textColour: '#ff0000',
            outlineColour: '#ff00ff',
            reverse: true,
            depth: 0.8,
            maxSpeed: 0.05
    });
*/
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

      // this should always find a view to the model...
      var itemView = null;
      for( viewId in this.children ){
        if( this.children[viewId].model.id == itemModel.id ){
          itemView = this.children[viewId];
        }
      }

      if( found ){
        jQuery(itemView.el).show();
      }
      else{
        jQuery(itemView.el).hide();
      }
    },this);
  },
  filter : function(e){
    // mark all other elements black
    jQuery("li.tagName",this.el).removeClass("red");

    //var filterText = e.srcElement.innerText.trim().toLowerCase();
    var filterText = jQuery("div.textSearch div.filter",this.el)[0].innerText.trim().toLowerCase();
    if( filterText == "(empty)" ){
      filterText = "";
    }
    //this._itemsCollectionView.filter(newFilter);

    for( viewId in this.children ){
      var childView = this.children[viewId];
      var matched = false;

      for( attrId in childView.model.attributes ){
        var v = childView.model.attributes[attrId];

        try{
          if( v && v.toLowerCase().match(filterText) ){
            matched = true;
          }
        }
        catch( e ){
          // do nothing... keep iterating
        }
      }
      if( matched ){
        jQuery(childView.el).show();
      }
      else{
        jQuery(childView.el).hide();
      }
    }
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

  notifyEvent : function( data ){
    //alert('here!');
    d = JSON.parse(data)

    if( d.id == this.model.get('id') ){
        this.model.fetch();
        this.matchedIssues.fetch();
    }
  },
  project : function() {
		window.location.href = window.location.href.match(".*(?=#)")
  },
});



App.Views.Items.ElicitUpdatingCollectionView = Backbone.View.extend({
  initialize : function(options) {
    _(this).bindAll();
 
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

App.Views.EllicitIssueSpeedButtons = Backbone.Marionette.View.extend({
  events : {
    'click div#expandAll' : 'expandAll',
    'click div#collapseAll' : 'collapseAll',
    'click div#clearFilter' : 'clearFilter',
    'click div#navigateToProject' : 'navigateToProject',
  },
  initialize : function(a){
    _(this).bindAll();
    this.mainView = a['mainView'];
    this.collection = this.mainView.collection;
  },
  render : function(){
    h="";
    h+="<div class='button orange' id='expandAll'>Expand All</div>";
    h+="<div class='button orange' id='collapseAll'>Collapse All</div>";
    h+="<div class='button orange' id='clearFilter'>Reset filter</div>";
    h+="<div class='button orange' id='navigateToProject'>View Project</div>";
    this.$el.html(h);
    //this.delegateEvents();
  },
  clearFilter: function(){
    //alert('to be implemented');
    this.mainView.renderTagList();
    this.mainView.filter();
  },
  navigateToProject : function(){
    location.hash = "/projects/"+ this.mainView.model.id;
  },
  expandAll: function(){
    _(this.mainView.children).each( function( v ) { v.doExpand() })
  },
  collapseAll: function(){
    _(this.mainView.children).each( function( v ) { v.doCollapse() })
  }

})
