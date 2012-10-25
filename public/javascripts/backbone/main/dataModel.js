/* this model is to be coupled with juggernaut notification mechanism  */

/*global App, Backbone,_,jQuery,eventer */

App.Data.Model = Backbone.Model.extend({

});


App.Data.Collection = Backbone.Collection.extend({
    model: App.Data.Model
});

App.Data.SuperCollection = Backbone.Collection.extend({
    collections : [],
    initialize : function( options ){
        _(this).bindAll();
        App.Data.SuperCollection.__super__.initialize.apply(this,options);
    },
    addCollection : function( collection ){
        // push it on the list of collections
        this.collections.push( collection );
        // add all its models 
        this.add( collection.models );
        // hook on
        collection.on('add',this.modelAdded, this );
        collection.on('removed',this.modelRemoved, this);
    },
    modelAdded : function( options ){
        this.add( options );
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
        this.relationsFrom = new App.Data.Relations();
    },
    notifyEvent : function( data ) {
        var e = JSON.parse(data);
        e.itemId = e.id;

        // if item id is not matching, then kill it fast
        if( e.id !== this.id ){
            return;
        }

        if( e.class === 'notify' && e.distance === 0 && (e.event === null || e.event === "") ){
            this.fetch();
        }
        if( e.class === 'notify' && e.event === "focused" ){
            this.trigger('focused',e.attribute); 
        }
        if( e.class === 'notify' && e.event === "blured" ){
            this.trigger('blured',e.attribute); 
        }
        
        
        /*
        switch( e.class ){
            case 'notify':
                break;
            default:
                break;
        }
        */

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
            throw new Error("Relation type specifier missing");
        }
        if( ! options.item ){
            throw new Error("relation tip specifier missing");
        }
        var url = "/relation/relate"
                + "?from_taggable_id=" + this.get('id')
                + "&to_taggable_id=" + options.item.get('id')
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
        var url = "/relation/relate"
                + "?from_taggable_id=" + this.get('id')
                + "&to_taggable_id=" + options.item.get('id')
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
            "undefined"
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
    getRelationsTo : function( relationType ){
        this.relationsTo.setItem( this,'to', relationType );
        this.relationsTo.fetch();
    },
    getRelationsFrom : function( relationType ){
        this.relationsFrom.setItem( this,'from', relationType );
        this.relationsFrom.fetch();
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
    }

});


App.Data.Items = App.Data.Collection.extend({
  url: '/items',
  model : App.Data.Item
});