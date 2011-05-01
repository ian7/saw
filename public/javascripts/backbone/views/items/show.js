/**
 * @author Marcin Nowak
 */
 
//require('backbone/application');

App.Views.Show = Backbone.View.extend({
	events: {
		"click .addTag": "addTag", 
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

		this.alternativesCollection.item_url = window.location.pathname+"/"+this.model.get('id');
		this.alternativesCollection.url = window.location.pathname+"/"+this.model.get('id')+'/alternatives';

		this.alternativesCollectionView = new App.Views.Alternatives.ListDetails({ collection: this.alternativesCollection, el: this.el });
		this.alternativesCollection.fetch();

        this.render();
    },
    
    render: function() {

			this.el.innerHTML = JST.items_show({ item: this.model });
			this.tags = new Tags;
			this.tags.url = this.model.get('item_url')+'/tag/tags_list';
			this.tags.view = this;
			this.tags.fetch({
				success: function(model,resp) {
				  	new App.Views.Tags.List({collection: model, el: model.view.el });
				},
			});
        
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
	notify: function( broadcasted_id ) {
		if( this.model.get('id') == broadcasted_id ){
				this.model.fetch({
					success : function( model, resp ){
//						model.change();
//						model.view.render();
					},
				});
		}
	},
});




