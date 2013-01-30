/* this model is to be coupled with juggernaut notification mechanism  */

/*global App, Backbone,_,jQuery,eventer */

App.Data.Model = Backbone.Model.extend({
    initialize : function(){
        App.Data.Model.__super__.initialize.apply(this,arguments);
        this.on('sync',this.onSync,this);
    },
    sync: function() {
        console.log('sync model');
        return Backbone.sync.apply(this, arguments);
    },
    onSync : function( model,resp,options ){
        console.log('onSync model');
    }
});


App.Data.Collection = Backbone.Collection.extend({
    model: App.Data.Model,
    initialize : function(){
        _(this).bindAll();

        App.Data.Collection.__super__.initialize.apply(this,arguments);
        this.on('sync',this.onSync,this);
        eventer.register(this);
    },
    onSync : function( collection,resp,options ){
        if( collection.ownerID ){
            var o;
            if( sessionStorage[collection.ownerID] ){
                o = JSON.parse(sessionStorage[collection.ownerID]);
            }
            else{
               o = {};
            }
            o[collection.url] = true;
            sessionStorage[collection.ownerID] = JSON.stringify( o );
        }
        App.connectionsCount = App.connectionsCount - 1;
    },
    sync: function( action, collection ) {
        var o = null;
        if( sessionStorage[collection.ownerID] ) {
            o = JSON.parse(sessionStorage[collection.ownerID]);
        }
        if( o && o[collection.url] ) {
            console.log("sync collection caught - ditching it");
            this.trigger('sync',this,o[collection.url],null);
            return null;
        }
        else {
            //console.log('sync collection');
            App.connectionsCount = App.connectionsCount + 1;
            return Backbone.sync.apply(this, arguments);
        }
    },
    notifyEvent : function( data ){
        var notification = JSON.parse( data );
        if( notification.distance === 1 ){
            sessionStorage.removeItem( notification.id );
        }
    }
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
        this.collections.splice( this.collection.indexOf( collection ),1 );
        // remove its models
        this.remove( collection.models );
        // hook off
        this.collection.off(null,null,this);
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


App.Data.Item = App.Data.Model.extend({
    
    relationsTo : null,
    relationsFrom : null,

    initialize : function(){
        _(this).bindAll();
        eventer.register(this);

        // initialization of the relations needs to happen here due to the late type declarations
        this.relationsTo = new App.Data.Relations();
        this.relationsTo.on('add',this.relationsToChanged,this);
        this.relationsTo.on('remove',this.relationsToChanged,this);
        this.updateRelationsTo = false;
        this.relationsFrom = new App.Data.Relations();
        this.relationsFrom.on('add',this.relationsFromChanged,this);
        this.relationsFrom.on('remove',this.relationsFromChanged,this);
        this.updateRelationsFrom = false;
    },
    relationsToChanged : function( model ){
        this.trigger('relationsToChanged',model);
        this.trigger('relationsChanged',model);
    },
    relationsFromChanged : function( model ){
        this.trigger('relationsToChanged',model);
        this.trigger('relationsChanged',model);
    },
    notifyEvent : function( data ) {
        var e = JSON.parse(data);
        e.itemId = e.id;

        // if item id is not matching, then kill it fast
        if( e.id !== this.get('id') ){
            return;
        }

        if( e.class === 'notify' && e.distance === 0 && (e.event === null || e.event === "" || e.event === "update") ){
            this.fetch();
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
       
        if( e.distance === 1 && ( 
                e.event === 'relate' || 
                e.event === 'unrelate' ||
                e.event === 'dotag' ||
                e.event === 'untag' ) 
           )
        {
         if( this.updateRelationsFrom ) {
            this.getRelationsFrom();
         }
         if( this.updateRelationsTo ){
            this.getRelationsTo();
         }
        }
        this.trigger('notify', e );
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
        var collection = null;

        if( collectionType ){
            // this assumes that collectionType is derrived from App.Data.Relations
            collection = new collectionType( collectionOptions );
        }
        else{
            collection = this.relationsTo;
        }
        collection.setItem( this,'to', relationType );
        collection.fetch();   

        return collection;
    },
    getRelationsFrom : function( relationType, collectionType, collectionOptions ){
        var collection = null;

        if( collectionType ){
            // this assumes that collectionType is derrived from App.Data.Relations
            collection = new collectionType( collectionOptions );
        }
        else{
            collection = this.relationsFrom;
        }
        collection.setItem( this,'from',relationType );
        collection.fetch();            
        
        return collection;
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
    }

});


App.Data.Items = App.Data.Collection.extend({
  url: '/items',
  model : App.Data.Item
});