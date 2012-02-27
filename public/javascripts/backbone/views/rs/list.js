/**
 * @author Marcin Nowak
 */
 

App.Views.Rs.Show = Backbone.View.extend({
	events: {
   "click div.expand": "expand", 
   "click div.focus" : "focus",
	},
    initialize: function() {
      _(this).bindAll('render');
	    this.model.bind('change', this.render);
    },
    
    render: function() {
//        this.el.innerHTML = JST.relations_show({relative: this.model });
        this.el.innerHTML = 
          //"<div class=\"button red focus\">focus</div>" +   
          "<div class=\"button orange expand\">expand</div>" +   
          //"<b>Id:</b> " + this.model.attributes.id +
          " <b>Name:</b> " + this.model.attributes.name +
          "<section class=\"subItem\"></section>";
        if( r_to_focus != null && r_to_focus == this.model.id ){
          this.expand();
        }

        this.hide();
        jQuery(this.el).slideDown(300);
         			
	      return this;
    },
    expand: function(){
            this.r= new R; 
            this.r.url = this.model.url();
            //e = jQuery(this.el).('section.subItem')
            this.subView = new App.Views.Rs.SubItems({model: this.r, el: jQuery('section.subItem',this.el) });           
            this.r.fetch({
              success: function(model, resp) {
              }
            });
            //this.view.render();
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
});


App.Views.Rs.List = Backbone.View.extend({
  events : {
    "keyup input.searchBox" : "searchBoxEdited",
  },
  initialize : function() {

  _(this).bindAll('newItem','checkNewItem','removeNewItem','newItem');

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

    h = "<input type=\"text\"/ class=\"searchBox\">"

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
    this.removeNewItem();
    this.newItem();
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
        }
        e+="</ul></td>"

        e+="<td><ul>"
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