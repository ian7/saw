/*global App, Backbone,_ */

Backbone.CollectionFilter = function(attributes, options) {
    this.initialize.apply(this, arguments);
};

var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find',
    'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any',
    'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex',
    'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf',
    'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

// Mix in each Underscore method as a proxy to `Collection#models`.
_.each(methods, function(method) {
    Backbone.CollectionFilter.prototype[method] = function() {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
    };


_.extend(Backbone.CollectionFilter.prototype, Backbone.Events, {
    models: [],
    /**
     * @constructor
     * it hooks up to the add/remove events of the original Backbone.Collection and refilters itself every time
     * new element is added or removed. 
     * @param  {hash} accepts collection and filter -> it should be hash of attributes and values to be matched in original collection
     * @return {nothing}
     */
    initialize: function(options) {
        _(this).bindAll();
        if( options.collection ){
            this.collection = options.collection;
        } else {
            throw new Error("Collection is undefined - filtering undefined makes no sense");
        }


        // this might be used by filterFunction
        this.filterParams = options.filterParams;

        if( options.filterFunction ){
            this.filter = options.filterFunction;
            this.setFilter();
        }



        if( options.filter ){
            this.setFilter( options.filter );
        }

        // backbone uses the same kind of magic...
        // Underscore methods that we want to implement on the Collection.
    },
    setFilter : function( filterSet ){
        this.collection.on('add', this.onAdd, this);
        this.collection.on('remove', this.onRemove, this);

        this.filterSet = filterSet;
        
        // and finally we should do the update on existing collection items
        this.updateModels();
        
        // and we trigger 'add' on those which were found at the beginnign
        _(this.models).each( function( model ) {
            this.trigger('add',model,this,{index: this.models.indexOf( model )});
        },this);

    },
    onAdd: function(model, collection, options) {
        // trigger actions only if item is accepted by the filter
        if(this.filter(model)) {
            this.updateModels();
            this.trigger('add', model, collection, options);
        }
    },
    onRemove: function(model, collection, options) {
        // trigger actions only if item is accepted by the filter
        if(this.filter(model)) {
            this.updateModels();
            this.trigger('remove', model, collection, options);
        }
    },
    /**
     * re-filters models of original collection and sets it here.
     * @return {nothing}
     */
    updateModels: function() {
        this.models = this.collection.filter(this.filter,this);
        this.length = this.models.length;
    },
    /**
     * This should be subsittuted by the customized filtering function, otherwise uses this.filter
     * @param  {Backbone.Model} model to be evaluated
     * @return {boolean} matched or not ;)
     */
    filter: function(model) {
        
        if(this.filterFunction){

            return( this.filterFunction.apply(this,model) );
            //return( this.filterFunction(model) );
        }
        
        if(this.filterSet) {
            var matched = true;
            _(this.filterSet).each(function(value, key) {
                // required match is null, but attribute isn't null
                // negative match against the pattern, or no key at all
                var v = model.get(key);
                if( (value === null && v !== null) ) {
                    matched = false;
                } 
                if( (value !== null && v === null) ) {
                    matched = false;
                }
    
                var expression = new RegExp("^"+value.toString()+"$","i");
                
                // for some mysterious reason this works
                if( (model.get(key) != null && model.get(key).match(expression) === null) ){ 
                    matched = false; 
                }
                
                // whereas this crashes... i would hihgly appreciate some expertise
                /*
                if( v != null ) {
                    //debugger
                    //console.log( "v: " + v + " value: " + value.toString() );
                    if(v  == value.toString() ) {
                        matched = false;
                    }
                }
                */
            }, this);
            if(matched === false) {
                return false;
            }
            return true;
        } else {
            return true;
        }
    }
  });
});