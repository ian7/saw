/* this model is to be coupled with juggernaut notification mechanism  */

/*global App, Backbone,_,jQuery,eventer,debug,config,unescape */

App.Data.Model = Backbone.Model.extend({
    initialize : function(){
        eventer.register(this);
        App.Data.Model.__super__.initialize.apply(this,arguments);

     
    },
    sync: function( action,model,options ) {

      if( action === 'read' && model.get('id')) {
            var storagedVal = localStorage[ 'i'+model.get('id') ];
            
            if( storagedVal ){
                App.cacheItemHit++;
                if( debug.cache ) {
                    console.log( 'model cache hit ('+model.get('id')+"')");
                }
                this.updateStamp(); 

                var value = JSON.parse(storagedVal);
                this.set( value );

                window.setTimeout( options.success, 1, this, value, options );
                //options.success(this, value, options);
            }
            else {        
    //            console.log('sync model');
                this.bbSuccess = options.success;
                options.success = this.onSync;
                options.complete = this.onComplete;
        
                App.connectionsCount = App.connectionsCount + 1;                
                return Backbone.sync.apply(this, arguments);
            }
        }
        else{
            if( this.get('id') ){
                localStorage.removeItem( 'i'+this.get('id') );
            }
            return Backbone.sync.apply(this, arguments);
        }
    },
    onComplete : function( model, resp, options ){
        App.connectionsCount = App.connectionsCount - 1;                        
    },
    onSync : function( model,resp,options ){
//        console.log('onSync model');
        if( !localStorage.updateStamp || localStorage.updateStamp < model.update_stamp ){
            localStorage.updateStamp = model.update_stamp;
            console.log('updateStamp bumped to: '+model.update_stamp);
        }

        if( this.bbSuccess ){
            this.bbSuccess(model,resp,options);
        }
        try {
            localStorage['i'+model.id] = JSON.stringify( model );  
        }
        catch( e ){
            var localStorageConsumed = unescape(encodeURIComponent(JSON.stringify(localStorage))).length;
            console.log( "there is " + localStorageConsumed + " bytes of localStorage consumed -- shrinking cache to: " + config.localStorageLimit );
            config.localStorageLimit = config.localStorage - 300;
            this.invalidateCache();
        }
        this.updateStamp(); 
    },
    notifyEvent : function( data ){
        var notification = JSON.parse( data );
        if( notification.id == this.get('id') && notification.distance === 0 ){
            this.invalidateCache();
        }
        if( notification.id == this.get('id') ){
            this.trigger('notify',notification);
        }
    },
    invalidateCache : function(){
        localStorage.removeItem( 'i' + this.get('id') );
        if( debug.cache ) {
            console.log('cache wiped for: ' + this.get('id') );
        }
    },
    reload : function( args ){
        this.invalidateCache();
        this.fetch( args );
    },
    updateStamp : function(){
        localStorage['s'+this.get('id')] = new Date().getTime();
    }
});


App.Data.Collection = Backbone.Collection.extend({
    model: App.Data.Model,
    initialize : function(){
        _(this).bindAll();

        App.Data.Collection.__super__.initialize.apply(this,arguments);
        //this.on('sync',this.onSync,this);
        eventer.register(this);
        this.on('add',this.onAdd,this);
    },
    onAdd : function(){
     //   console.log('added');
    },
    /* this part implements client-side call cache... */
    onSync : function( collection,resp,options ){
        if( this.ownerID ){
            var o;
            if( localStorage[this.ownerID] ){
                o = JSON.parse(localStorage['r'+this.ownerID]);
            }
            else{
               o = {};
            }
            o[this.url] = collection;

            try{
                localStorage['r'+this.ownerID] = JSON.stringify( o );
            }
            catch( e ){
                var localStorageConsumed = unescape(encodeURIComponent(JSON.stringify(localStorage))).length;
                config.localStorageLimit = config.localStorage - 300;
                console.log( "there is " + localStorageConsumed + " bytes of localStorage consumed -- shrinking cache to: " + config.localStorageLimit );
                this.invalidateCache();
            }
        }
       this.bbSuccess(collection,resp,options);
    },
    onComplete : function( collection, resp, options ){
       App.connectionsCount = App.connectionsCount - 1;
    },
    sync: function( action, collection, options ) {
        var o = null;
        if( action === 'read' && localStorage['r'+collection.ownerID] ) {
            o = JSON.parse(localStorage['r'+collection.ownerID]);
        }
        if( action === 'read' && o && o[collection.url] ) {
            //this.reset(o[collection.url]);
            //this.reset(o[collection.url]);
            if( debug.cache ){
                console.log("collection cache hit ("+ o[collection.url].length + "," + this.length +")" + collection.url + ")");
            }
            App.cacheCollectionHit ++;

            //options.success( o[collection.url],'success', null);
            window.setTimeout( options.success, 1, o[collection.url], 'success', null );


            this.trigger('cached'); 
/*            if( this.refreshExistingRelations){
                this.refreshExistingRelations();
            } 
*/
            //collection.trigger('sync', collection, o[collection.url]);
            return true;
        }

        if( action === 'read') {
            this.bbSuccess = options.success;
            options.success = this.onSync;
            options.complete = this.onComplete;
            
            App.connectionsCount = App.connectionsCount + 1; 
            if( !this.url ){
                debugger;
            }       
            return Backbone.sync.apply(this, arguments);
        }
        else {
            //console.log('sync collection');
            //
            
            App.connectionsCount = App.connectionsCount + 1;
            return Backbone.sync.apply(this, arguments);
        }
    },
    notifyEvent : function( data ){
        if( this.ownerID ) {
            var notification = JSON.parse( data );
            if( notification.id === this.ownerID && notification.distance === 1 ){
                this.invalidateCache();
            }
        }
    },
    invalidateCache : function(){
        localStorage.removeItem( 'r'+this.ownerID );
        if( debug.cache ){
            console.log('relation cache wiped for: ' + this.ownerID );
        }
    },
    reload : function( args ){
        this.invalidateCache();
        this.fetch( args );
    },
    updateStamp : function(){
        localStorage['s'+this.ownerID] = new Date().getTime();
    }
    /* end of client-side cache */
});

App.Data.SuperCollection = Backbone.Collection.extend({
    collections : [],
    initialize : function( options ){
        _(this).bindAll();
        App.Data.SuperCollection.__super__.initialize.apply(this,options);
    },
    // overrides default collection's fetch
    fetch : function(){
        _(this.collections).each( function( collection ){
            collection.fetch();
        },this);
    },
    addCollection : function( collection ){
        // push it on the list of collections
        this.collections.push( collection );

        // puhs all models of the incoming collection through the filter :)
        _(collection.models).each( function( model ){
            this.modelAdded(model);
        },this);

        // hook on
        collection.on('add',this.modelAdded, this );
        collection.on('remove',this.modelRemoved, this);
        collection.on('change',this.modelChanged,this);
        collection.on('reset',this.onCollectionReset,this);
    },
    modelAdded : function( model ){

        // respecting filter-if exists
        if( this.addFilter ) {
            // if filter says true, then add it, otherwise ignore.
            if( this.addFilter( model )){
                this.add( model );
            }
            else{
                // do nothing.
            }
        }
        else{
            this.add( model );
        }   
    },
    removeCollection : function( collection ){
        // remove it from the list of collections
        this.collections.splice( this.collections.indexOf( collection ),1 );
        // remove its models
        this.remove( collection.models );
        // hook off
        collection.off(null,null,this);
    },
    modelRemoved : function( options ){
        // i should test it one day...
        this.remove( options );
    },
    modelChanged : function(){
     /*   if( this.comparator ){
            this.sort();
        }*/
    },
    onCollectionReset : function( subCollection ){
        this.trigger('reset',this);
    }

});


App.Data.RelatedCollection = Backbone.Collection.extend({
    
    // this gets set in the initializer
    model : null,

    initialize : function( models, options ){
        _(this).bindAll();

        App.Data.RelatedCollection.__super__.initialize.apply(this,arguments);

        if( options.item ){
            this.item = options.item;
            switch( options.direction ){
                case 'from':
                    this.relations = options.item.getRelationsFrom();
                    this.relationEnd = 'tip';
                    break;
                case 'to':
                    this.relations = options.item.getRelationsTo();
                    this.relationEnd = 'origin';
                    break;
                default:
                    throw new Error('Wrong direction!');
                }
        }

        if( options.relations ){
            this.relations = options.relations;
            this.relationEnd = options.relationEnd;
        }

        if( (!options.item && !options.relations) || 
            (options.item && !options.direction) ||
            (options.relations && !options.relationEnd )){
            throw new Error("I need either relations+relationEnd or item+direction in options");
        }

        // this is what's going to be instantiated for the purpose of this collection
        if( options.model ){
            this.model = options.model;
        }
        // otherwise by default we are going to be instantiating App.Data.Item
        else{
            this.model = App.Data.Item;
        }

        // optionally relations can be actually filtered
        if( options.filter ){
            this.filter = options.filter;
        }

        this.relations.on('add',this.onRelationAdd,this);
        this.relations.on('remove',this.onRelationRemove,this);

      //  this.relations.on('reset',this.refreshExistingRelations,this);
      //  this.relations.on('cached',this.refreshExistingRelations,this);
        // let's add what we have now...
        this.refreshExistingRelations();
        return this;
    },
    refreshExistingRelations : function(){
        //console.log('relatedCollection: adding: ' + this.relations.models.length + ' existing models' );
        _(this.relations.models).each( function( relation ){
            this.onRelationAdd( relation );
        },this);
    },
    onRelationAdd : function( relation ){
        
        // if it doesn't go through the filter, then ditch it immediately
        if( !this.filter( relation )){
            return;
        }

        // let's make a new thing..
        var newItem = new this.model({id:relation.get(this.relationEnd)});

        // that should handle faulty load...
        newItem.on('error',this.onItemFetchError,this);

        // leave a reference - might come handy later on
        newItem.metaData = {
            relation : relation
        };

        // pool for the attributes. 
        newItem.fetch();
        
        //console.log('relatedCollection: adding ' + newItem.get('type') + " total: " + this.length);
        
        if( !newItem.get('type')  ){
            //debugger;
        }
            
        // now plainly add it to the other items
        this.add(newItem);
    },
    onRelationRemove : function( relation ){
        
        var relatedItem = _(this.models).find( function( itemModel ){
            return itemModel.get('id') === relation.get(this.relationEnd);
        },this);

        if( relatedItem ){
            this.remove( relatedItem );
        }
        // this actually disposes the object. 
    },
    onItemFetchError : function( item ){
        this.remove( item );
    },
    filter : function( item ){
        return true;
    }
});


App.Data.FilteredCollection = Backbone.Collection.extend({
    initialize : function( models, options ){
        _(this).bindAll();

        if( !options.collection ){
            throw new Error("it doesn't make sense to filter without collection" );
        }

        if( options.filter ) {
            this.filter = options.filter;
        }
        else {
            //throw new Error("it doesn't make sense to filter without filter");
            console.log("it doesn't make sense to filter without filter");
        }
        
        this.filterParams = options.filterParams;

        this.collection = options.collection;
        this.collection.on('add',this.onAdd,this);
        this.collection.on('remove',this.onRemove,this);
        this.collection.on('change',this.onChange,this);

        // in case our collection has different model types
        if( options.model ){
            this.model = options.model;
        }
        // otherwise just copy model from the filtered collection
        else{
            this.model = this.collection.model;
        }
        


        // let's add what we have now...
        _(this.collection.models).each( function( model ){
            this.onAdd( model );
        },this);

    },
    onAdd : function( item ){
        if( !this.filter( item ) ){
            return;
        }
        var newModel = new this.model( item.attributes );

        newModel.metaData = item.metaData;

        this.add( newModel ); 
           
    },
    onRemove : function( item ){
        var foundModel = _(this.models).find( function( model ){
            return( item.get('id') === model.get('id') );
        },this);

        if( foundModel ){
            this.remove( foundModel );
        }
    },
    onChange : function( item ){
        var foundModel = _(this.models).find( function( model ){
            return( item.get('id') === model.get('id') );
        },this);

        if( foundModel && !this.filter( item )){
            this.onRemove( item );
        }

        if( !foundModel && this.filter( item )){
            this.onAdd( item );
        }
    },
    filter : function( model ){
        return true;
    }


});

App.Data.Item = App.Data.Model.extend({
    
    relationsTo : null,
    relationsFrom : null,

    initialize : function(){
        
        App.Data.Item.__super__.initialize.apply(this,arguments);
        
        _(this).bindAll();
        //eventer.register(this);

        // initialization of the relations needs to happen here due to the late type declarations
        this.relationsTo = new App.Data.Relations();
        this.relationsTo.setItem( this );
        this.relationsTo.on('add',this.relationsToChanged,this);
        this.relationsTo.on('remove',this.relationsToChanged,this);
        this.updateRelationsTo = false;
        this.relationsFrom = new App.Data.Relations();
        this.relationsFrom.setItem( this );
        this.relationsFrom.on('add',this.relationsFromChanged,this);
        this.relationsFrom.on('remove',this.relationsFromChanged,this);
        this.updateRelationsFrom = false;
        this.on('change:id',this.onIdChanged,this);

        this.on('destroy',this.onDestroy,this);
        this.on('notify',this.onNotifyItem,this);
    },
    onIdChanged : function(){
        
        // if id is set to nullm then it doesnt make sense to touch anything. 
        if( !this.get('id') ){
            return;
        }

        this.relationsTo.setItem(this,'to');
        this.relationsFrom.setItem(this,'from');
        
        if( this.updateRelationsTo ){
            this.relationsTo.reload();
        }
        if( this.updateRelationsFrom ){
            this.relationsFrom.reload();
        }
    },
    relationsToChanged : function( model ){
        this.trigger('relationsToChanged',model);
        this.trigger('relationsChanged',model);
    },
    relationsFromChanged : function( model ){
        this.trigger('relationsToChanged',model);
        this.trigger('relationsChanged',model);
    },
    onNotifyItem : function( e ) {
        //var e = JSON.parse(data);
        e.itemId = e.id;

        // if item id is not matching, then kill it fast
        //if( e.id !== this.get('id') ){
        //    return;
        //}

        if( e.class === 'notify' && e.distance === 0 && (e.event === null || e.event === "" || e.event === "update") ){
            this.reload();
        }
        if( e.class === 'notify' && e.event === "focused" ){
            this.trigger('focused',e.attribute); 
        }
        if( e.class === 'notify' && e.event === "blured" ){
            this.trigger('blured',e.attribute); 
        }
        
        if( e.event === 'destroy' && e.distance === 0 ){
            if( this.collection) {
                this.collection.remove(this);
            }
            this.off();

        }
        /*
        switch( e.class ){
            case 'notify':
                break;
            default:
                break;
        }
        */
       
        if( e.distance === 1
        /* && ( 
                e.event === 'relate' || 
                e.event === 'unrelate' ||
                e.event === 'dotag' ||
                e.event === 'untag' ||
                e.event === 'destroy') 
          */ )
        {
         if( this.updateRelationsFrom ) {
            this.relationsFrom.reload();
         }
         if( this.updateRelationsTo ){
            this.relationsTo.reload();
         }
        }
      //  this.trigger('notify', e );
    },
    url : function() {
        if( this.id ) {
            return '/r/' + this.id;
        }
        else {
            return '/r';
        } 
    },
    tag : function( item, options ){
        
        var url = '/r/'+this.get('id')+'/dotag?from_taggable_id='+item.get('id');
        if( options ){
            _(options).each( function( value, key ) {
                var optionString = "&" + key + "=" + value;
                url += optionString;
            });
        }

        jQuery.getJSON( url , function(data) {});
    },
    untag : function( item, options ) {
        var url = '/r/'+this.get('id')+'/untag?from_taggable_id='+item.get('id');
        if( options ){
            _(options).each( function( value, key ) {
                var optionString = "&" + key + "=" + value;
                url += optionString;
            });
        }
        jQuery.getJSON( url , function(data) {});
    },
    relate : function( options ){
        /* expected are:
            options.relation
            options.item
            */
        if( ! options.relation ){
            options.relation = "Tagging";
        }
        if( ! options.item ){
            throw new Error("relation tip specifier missing");
        }

        var item_id = null;

        if( typeof( options.item ) === "object" ){
            item_id = options.item.get('id');
        }

        if( typeof( options.item ) === "string" ){
            item_id = options.item;
        }

        var url = "/relation/relate"
                + "?to_taggable_id=" + this.get('id')
                + "&from_taggable_id=" + item_id
                + "&relation_name=" + options.relation;

        jQuery.getJSON( url , this.related );

    },
    related : function( data ){
        this.trigger('related',this,data);
    },
    unrelate : function( options ){
        /* expected are:
            options.relation
            options.item
            */
        if( ! options.relation ){
            throw new Error("Relation type specifier missing");
        }
        if( ! options.item ){
            throw new Error("relation tip specifier missing");
        }

        var item_id = null;

        if( typeof( options.item ) === "object" ){
            item_id = options.item.get('id');
        }

        if( typeof( options.item ) === "string" ){
            item_id = options.item;
        }


        var url = "/relation/unrelate"
                + "?to_taggable_id=" + this.get('id')
                + "&from_taggable_id=" + item_id
                + "&relation_name=" + options.relation;

        jQuery.getJSON( url , this.related );
    },
    unrelated : function ( data ){
        this.trigger('unrelated',this,data);    
    },
    getAttributes : function() {
        var nonAttributes = [
            "Your_decision",
            "Relation_id",
            "Relation_url",
            "Alternative_url",
            "Project_id",
            "id",
            "decisions",
            "type",
            "item_url",
            "undefined",
            "created_at",
            "updated_at",
            "update_stamp",
            "author_name",
            "author"
        ];
        var attributes = [];

        _(this.attributes).each(function(value, key){
            attributes.push( key );
        },this);

        return( _.difference( attributes, nonAttributes ));
    },
    notifyFocused : function( attribute ){
        jQuery.getJSON('/notify/' + this.get('id') + '/' + attribute + '/focused', function(data) {});
    },
    notifyBlured : function( attribute ){
        jQuery.getJSON('/notify/' + this.get('id') + '/' + attribute + '/blured', function(data) {});
    },
    notify : function( event ){

        switch( typeof( event )){
            case 'object':
                  jQuery.post('/r/' + this.get('id') + '/notify', JSON.stringify(event), function( data ){});
                break;
            case 'string':
                jQuery.getJSON('/notify/' + this.get('id') + '/' + event, function( data ){});
                break;
            default:
                // that shouldn't happen
                break;
        }

    },
    getRelationsTo : function( relationType, collectionType, collectionOptions ){     
        
        if( !this.updateRelationsTo ){
            this.updateRelationsTo = true;

            if( !this.isNew() ) {
                this.relationsTo.setItem(this,'to');
                this.relationsTo.fetch();  
            }
        }

        return this.relationsTo;
    },
    getRelationsFrom : function( relationType, collectionType, collectionOptions ){

        if( !this.updateRelationsFrom ){
            this.updateRelationsFrom = true;
            if( !this.isNew() ) {
                this.relationsFrom.setItem(this,'from');
                this.relationsFrom.fetch();   
            }
        }

        return this.relationsFrom;
    },
    getRelatedTo : function( collectionType, itemType ){
        var newCollection = new collectionType();
        if( itemType ){
            newCollection.url = this.url() + "/related_to/" + itemType;
        }
        else{
            newCollection.url = this.url() + "/related_to";
        }
        return newCollection;
    },
    getRelatedFrom : function( collectionType, itemType ){
        var newCollection = new collectionType();
        if( itemType ){
            newCollection.url = this.url() + "/related_from/" + itemType;
        }
        else{
            newCollection.url = this.url() + "/related_from";
        }
        return newCollection;
    },
    isSealed : function(){
        var sealTag = App.main.context.tags.where({'type':'Status','name':'Sealed'})[0];
        var sealTaggings = _(this.relationsTo.models).find( function( relation ) {
            return( relation.get('origin') === sealTag.get('id') );
        },this);

        if( sealTaggings ){
            return sealTaggings;
        }        
        else{
            return false;
        }
    },
    toggleSeal : function(){
        var sealTag = App.main.context.tags.where({'type':'Status','name':'Sealed'})[0];

        var sealing = this.isSealed();
        if( sealing ){
            sealing.destroy();
        }
        else{
            this.tag( sealTag );
        }
    },
    onDestroy : function(){
        this.unset('id');
        this.relationsTo.off();
        this.relationsFrom.off();
    }

});


App.Data.Items = App.Data.Collection.extend({
  url: '/items',
  model : App.Data.Item
});