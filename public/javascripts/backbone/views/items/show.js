/**
 * @author Marcin Nowak
 */
 
//require('backbone/application');

App.Views.Show = Backbone.View.extend({
	events: {
		"click .addTag": "addTag", 
		"keypress .editable" : "editedAttribute",
	},
    initialize: function() {
		//this.tagCollection = new Tags;
		_(this).bindAll('render');
		notifier.register(this);
		
		// load and render navigation helper
		_.extend( this, App.Helpers.ItemNavigation );

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


//		this.alternativesCollectionView = new App.Views.Alternatives.ListDetails({ collection: this.alternativesCollection, el: this.el });

		this.model.bind('change',this.render);

		this.tags = new Tags;
		this.tags.view = this;
	  	this.tagsView = new App.Views.Tags.List({collection: this.tags, el: this.el });
    },
    
    render: function() {
		this.renderNavigation();

/*		this.alternativesCollection.item_url = this.model.url();
		this.alternativesCollection.url = this.model.url()+'/alternatives';
		this.alternativesCollection.fetch();*/

			jQuery(this.el).append( JST.items_show({ item: this.model }));

		this.tags.url = this.model.url()+'/tag/tags_list';
		this.tags.fetch();
		this.tagsView.render();
		
		return( this );

    },
	addTag: function(){
		this.tags = new Tags;
		this.tags.url = this.model.get('item_url')+'/tag/list';
		this.tags.view = this;
		
		this.tags.fetch({
			success: function( model, resp ){
				new App.Views.Tags.AddTag({ collection: this.tags, el: 'table.tagsList' })
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
		this.tags.fetch();
//		this.alternativesCollection.fetch();
//		{deepRefresh: true}
		}
	},
	refresh : function () {
		this.model.fetch();
		this.aternativesCollection.fetch()
	},
	editedAttribute : function( e ) {
			if (e.keyCode == 13) {
				var newValue = e.srcElement.innerHTML;

				if(newValue == "<br>") {
					newValue = '(empty)';
				}
				var changeSet = new Object;
				
				changeSet[e.srcElement.id] = newValue;
				this.model.save(
					changeSet,
					{ success : function( model, resp)  {
						
					}
				});			
			}
	
	},
});




