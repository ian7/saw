/*global App, Backbone,_ */

Backbone.CollectionFilter = function(attributes, options) {
    this.initialize.apply(this, arguments);
};

_.extend(Backbone.CollectionFilter.prototype, Backbone.Events, {
    models: [],
    /**
     * it hooks up to the add/remove events of the original Backbone.Collection and refilters itself every time
     * new element is added or removed. 
     * @param  {hash} accepts collection and filter -> it should be hash of attributes and values to be matched in original collection
     * @return {nothing}
     */
    initialize: function(options) {
        _(this).bindAll();
        this.collection = options.collection;
        if( options.filter ){
            this.setFilter( options.filter );
        }
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
        this.models = this.collection.filter(this.filter);
        this.length = this.models.length;
    },
    /**
     * This should be subsittuted by the customized filtering function, otherwise uses this.filter
     * @param  {Backbone.Model} model to be evaluated
     * @return {boolean} matched or not ;)
     */
    filter: function(model) {
        if(this.filterSet) {
            var matched = true;
            _(this.filterSet).each(function(value, key) {
                // required match is null, but attribute isn't null
                // negative match against the pattern, or no key at all
                if( (value === null && model.get(key) !== null) || 
                    (value !== null && model.get(key) === null) ||
                    (model.get(key) !== null && model.get(key).match(value) === null) ){
                    matched = false;
                }
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