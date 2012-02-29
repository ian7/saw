/**
 * @author Marcin Nowak
 */
 

App.Views.Rs.Show = Backbone.View.extend({
	events: {
   "click div.expand": "toggleExpand", 
   "click"           : "expand", 
   "click div.focus" : "focus",
//   "mouseenter"       : "expand",
//   "mouseleave"      : "unexpand",
    "keypress .editable" : "editedAttribute",
	},
    initialize: function() {
      _(this).bindAll('render');
	    this.model.bind('change', this.render);
      this.expanded = false;


    },
    render: function() {
//        this.el.innerHTML = JST.relations_show({relative: this.model });
        
        h = "<div class=\"button orange expand\">expand</div>" ;
        h +="<table class=\"rAttributes\">";

        for( attribute in this.model.attributes ) {
          // some attributes aren't really worth mentioning...
          switch( attribute ){
            case 'url':
            case 'type':
            case 'id':
              // in case when one of mentioned above was found, then iterate to next attribute
              continue;
              break;
            case 'related_from':
            case 'related_to':
              // relations aren't really to be editied as text fields
              continue;
              break;
            case null:
            case 'undefined':
              // no idea why this pops up
              continue;
              break;
            default:
              break;
          }
          h+="<tr>"
            h += "<td class=\"attributeName\">" + attribute +"</td>";
            h += "<td class=\"attributeValue editable\" contenteditable=\"true\" id=\""+ attribute +"\">" 
              + this.model.attributes[attribute] 
              + "</td>";
          h+="</tr>"
        };
        h+="</table>";


        h += "<section class=\"subItem\"></section>";

        this.el.innerHTML = h;

/*
        this.el.innerHTML = 
          //"<div class=\"button red focus\">focus</div>" +   
          //"<b>Id:</b> " + this.model.attributes.id +
          " <b>Name:</b> " + this.model.attributes.name +
          */
  


        this.r= new R; 
        this.r.url = this.model.url();

        this.subViewEl = jQuery('section.subItem',this.el);
        this.subView = new App.Views.Rs.SubItems({model: this.r, el: this.subViewEl });           

        if( r_to_focus != null && r_to_focus == this.model.id ){
          this.expand();
        }

        this.hide();
        jQuery(this.el).slideDown(300);
        return this;
    },
    expand: function(){
      if( !this.expanded ) {
        jQuery("div.expand",this.el)[0].innerHTML="unExpand";

        this.r.fetch({
          success: function(model, resp) {
          }
        });
        this.expanded = true;
        //this.view.render();
        //this.subViewEl.show();
        this.subViewEl.hide();
        this.subViewEl.slideDown(300);
      }
      return this;
    },
    unexpand: function(){
      jQuery("div.expand",this.el)[0].innerHTML="expand";

      this.expanded = false;
      //this.subViewEl.hide();
      this.subViewEl.slideUp(500);
      //jQuery('section.subItem',this.el).empty();

      return this;
    },
    toggleExpand : function(){
      if( this.expanded ){ 
        this.unexpand();
      }
      else {
        this.expand();
      }
    },
    focus: function(){
      App.Components.Rs.navigate(this.model.attributes.type+"/"+this.model.attributes.id,{trigger: true})
    }, 
    hide: function(){
      jQuery( this.el ).hide();
    },
    show: function(){
      jQuery( this.el ).show();
    },
    editedAttribute : function( e ) {
      if (e.keyCode == 13) {
        var newValue = e.srcElement.innerHTML;

        if(newValue == "<br>") {
          newValue = '(empty)';
        }
        /*
        var changeSet = new Object;
        changeSet[e.srcElement.id] = newValue;
        */

        //this.model.attributes[e.srcElement.id] = newValue;
        var ee= e.srcElement.id;
        this.model.set(ee,newValue);
        this.model.save();
          //{ success : function( model, resp)  {
         // }
        //});     
      }
    },
});


App.Views.Rs.List = Backbone.View.extend({
  events : {
    "keyup input.searchBox" : "searchBoxEdited",
  },
  initialize : function() {

//  _(this).bindAll('newItem','checkNewItem','removeNewItem','newItem');
// _(this).bindAll('newItem','removeNewItem');

  this.collection.bind('saved',this.checkNewItem );
  this.collection.bind('refresh',this.checkNewItem );

	this.relationsCollectionView = new UpdatingCollectionView({
      collection           : this.collection,
      childViewConstructor : App.Views.Rs.Show,
      childViewTagName     : 'div',
      childViewClassName   : 'r'
    });
  	_(this).bindAll('render');
  },
  render : function() {

    h = "<div class=\"listWidget\">" 
      + "<div class=\"list\"></div>"
      + "</div>";

    this.el.innerHTML = h;  

		this._rendered = true;

    h = "<input type=\"text\"/ class=\"searchBox\">";

    e = jQuery("div.listWidget", this.el);
    e.prepend( h );
    this.relationsCollectionView.el = jQuery("div.list",this.el);
		this.relationsCollectionView.render();
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
    i = new Item;

    // this.newItemName is unavailable when called by the 'save' event from the collection
    i.set({name: '(new item)' });
    collection.add( i );    
  },

  checkNewItem : function() {
//    this.removeNewItem();
 //   this.newItem();
  },
  searchBoxEdited : function() {
    input = jQuery("input.searchBox",this.el)[0].value;
    this.relationsCollectionView.filter( input );
    },
});



App.Views.Rs.SubItems = Backbone.View.extend({
  events: {
       "click .button": "pivot", 
  },
    initialize: function() {
      _(this).bindAll('render');
      this.model.bind('change', this.render);
    },
    
    render: function() {
//        this.el.innerHTML = JST.relations_show({relative: this.model });
        e="<table width=100%><tr><th with=50%>Related to:</th><th width=50%>Related from:</th><tr>"
        e+="<td><ul>"
        for( rel_to in this.model.attributes.related_to ){
          e+="<li>"+
            " <div class=\"button green\" id=\""+
              this.model.attributes.related_to[rel_to].type +
              "/" +
              this.model.attributes.related_to[rel_to]._id +
              "\">pivot</div>" +
            "<b>" +
            this.model.attributes.related_to[rel_to].type +
            "</b>: " +          
            this.model.attributes.related_to[rel_to].name +
            "</li>";            "</li>";
        };
        e+="</ul></td>";

        e+="<td><ul>";
        for( rel_to in this.model.attributes.related_from ){
          e+="<li>"+
            " <div class=\"button green\" id=\""+
              this.model.attributes.related_from[rel_to].type +
              "/" +
              this.model.attributes.related_from[rel_to]._id +
              "\">pivot</div>" +
            "<b>" +
            this.model.attributes.related_from[rel_to].type +
            "</b>: " +          
            this.model.attributes.related_from[rel_to].name +
            "</li>";
        }
        e+="</ul></td></tr></table>"

        this.el.innerHTML=e;
         jQuery(this.el).hide();
         jQuery(this.el).slideDown(200);
                
        return this;
    },
    pivot: function( e ){
        App.Components.Rs.navigate(e.target.id,{trigger: true});
    },
 });