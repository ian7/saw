/*global Backbone,App,_*/

App.Data.Relation = App.Data.Item.extend({

});


App.Data.Relations = App.Data.Collection.extend({
    model: App.Data.Relation,
    setItem : function( item, direction, relationType ){
        // if there is a relation type defined, then we should feel like using it. 
        if( relationType ) {
            this.url = '/r/' + item.get('id') + "/relations_"+direction+'/'+relationType;
        }
        else {
            this.url = '/r/' + item.get('id') + "/relations_"+direction;
        }
        this.ownerID = item.get('id');
    }
});
