/* this model is to be coupled with juggernaut notification mechanism  */

/*global App, Backbone,_,jQuery */

App.Data.Model = Backbone.Model.extend({

});


App.Data.Item = App.Data.Model.extend({
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
    }
});


App.Data.Items = App.Data.Collection.extend({
  url: '/items',
  model : App.Data.Item
});