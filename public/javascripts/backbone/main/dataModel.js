/* this model is to be coupled with juggernaut notification mechanism  */

/*global App, Backbone,_,jQuery,eventer */

App.Data.Model = Backbone.Model.extend({

});


App.Data.Collection = Backbone.Collection.extend({
    model: App.Data.Model
});



App.Data.Item = App.Data.Model.extend({
    initialize : function(){
        _(this).bindAll();
        eventer.register(this);
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
    }
});


App.Data.Items = App.Data.Collection.extend({
  url: '/items',
  model : App.Data.Item
});