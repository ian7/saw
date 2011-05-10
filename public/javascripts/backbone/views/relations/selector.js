/**
 * @author Marcin Nowak
 */
 

App.Views.Relations.Selector = Backbone.View.extend({
	relationTypes : {
		"Implies" : "Alternative",
		"Contradicts" : "Alternative",
		"Influences" : "Issue",
		"Tagging"	: "",
	},
	relationCounts : {
		"xx" : "jest !!!",
	},
	events: {
//		"click .unTag"	: 	"unTag", 
		"click .switchView" : "switchView",
/*
*/
	},
    initialize: function() {
		_(this).bindAll('render','switchView');

		// let's fetch some relations of this alternative...
		this.relationsCollection = new Relations;
		this.relationsCollection.bind('refresh',this.render);

		this.relativesCollection = new Relatives;
		this.relativesView = new App.Views.Relations.List( {el: this.el, collection: this.relativesCollection });

		this.relationsCollection.url = this.model.url()+'/relations/to';
		this.relationsCollection.fetch();

    },
  	switchView : function( e ) {
		// button id is set in the relations_selector.jst template, so we can recover it here
		// e.srcElement.id

		this.relativesCollection.url = this.model.url()+'/relations/tree_to?type='+e.srcElement.id;
		this.relativesCollection.fetch()		
		this.relativesView.render();
    },
    updateCounts : function() {

		// goes over collection of relations and does the sum-up
		this.relationCounts = new Object;
		this.relationsCollection.each( function( relation ) {

			if( !this.relationCounts[ relation.get('type') ] ) {
				this.relationCounts[ relation.get('type') ] = 1;
			}
			else {
				this.relationCounts[ relation.get('type') ] = this.relationCounts[ relation.get('type') ]  + 1;
			}

		},this);

	},
    render: function() {

		
		this.updateCounts();
		
       	this.el.html( JST.relations_selector({ relationCounts: this.relationCounts, relationTypes: this.relationTypes, ative: this.model } ));
			
		return this;
    },
	unTag : function() {
	 	jQuery.getJSON(this.model.get('item_url')+'/tag/untag?tagging_id='+this.model.get('tagging_id'), function(data) {
   		});
	}
});

