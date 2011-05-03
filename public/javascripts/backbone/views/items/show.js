/**
 * @author Marcin Nowak
 */
 
//require('backbone/application');

App.Views.Show = Backbone.View.extend({
	events: {
		"click .addTag": "addTag", 
		"click .toIndex" : "navigateToIndex",
	},
    initialize: function() {
		//this.tagCollection = new Tags;
	_(this).bindAll('render');
			notifier.register(this);

      /* let's forget about that for a moment
  		_.extend( this, Backbone.Events );
        
        this.bind('update',function( item_id ){
        	if( App.Components.Items.tags ){
        		App.Components.Items.tags.trigger('update',item_id);
        	}
        	
        	if( App.Components.Items.alternatives ){
        		App.Components.Items.alternativess.trigger('update',item_id);
        	}
        });
*/

		this.alternativesCollection = new Alternatives;
		this.alternativesCollection.issueView = this;


		this.alternativesCollectionView = new App.Views.Alternatives.ListDetails({ collection: this.alternativesCollection, el: this.el });

		this.model.bind('change',this.render);
    },
    
    render: function() {
		this.alternativesCollection.item_url = this.model.url();
		this.alternativesCollection.url = this.model.url()+'/alternatives';

		this.alternativesCollection.fetch();

			this.el.innerHTML = JST.items_show({ item: this.model });
/*			this.tags = new Tags;
			this.tags.url = this.model.get('item_url')+'/tag/tags_list';
			this.tags.view = this;
			this.tags.fetch({
				success: function(model,resp) {
				  	new App.Views.Tags.List({collection: model, el: model.view.el });
				},
			});
 */      
	   // this handles in-place editing
       jQuery('.edit5').each( function(i){
       	  jQuery(this).attr('contenteditable','true');
       	  jQuery(this).keypress( function() {
       	  	jQuery(this).stopTime("edit5")
       	  	jQuery(this).oneTime(1000,"edit5", function() {
		         jQuery.ajax({
		         	type: 'PUT',
		         	url: '/items/'+item_id,
		         	data: jQuery(this).attr('id')+'='+jQuery(this).html()   	 
		         });       	  		
       	  	});
       	  });	               	  	
       	 });        
		this.alternativesCollectionView.render();

		return( this );
		// alternatives list

    },
	addTag: function(){
		this.tags = new Tags;
		this.tags.url = this.model.get('item_url')+'/tag/list';
		this.tags.view = this;
		
		this.tags.fetch({
			success: function( model, resp ){
				new App.Views.Tags.AddTag({ collection: model, el: model.view.el })
			}
		});
	},
	navigateToIndex : function() {
		window.location.href = window.location.href.match(".*#")	
	},
	notify: function( broadcasted_id ) {
		if( this.model.get('id') == broadcasted_id ){
				this.model.fetch({
					success : function( model, resp ){
//						model.change();
//						model.view.render();
					},
				});
				this.alternativesCollection.fetch({deepRefresh: true});
		}
	},
});




