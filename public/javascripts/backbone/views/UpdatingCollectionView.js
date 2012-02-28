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