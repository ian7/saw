/*global Backbone,App,_*/

App.Models.Project = App.Data.Item.extend({
    initialize : function( model ){
      _(this).bindAll();

      App.Models.Project.__super__.initialize.apply(this);
      
 //     this.set('type','Project');


      //this.parent = null;

      this.allRelationsTo = new App.Data.SuperCollection();
      this.allRelationsFrom = new App.Data.SuperCollection();


      if( model ) {
        this.parse( model );
      }
      

      this.updateRelationsFrom = true;
    },
    create : function(){
      this.unset('id');
      this.set('type','Project');
      this.save();
    },
    parse: function( response ){
        this.id = response.id;
        // this converts simple children entry into the collections - 
        this.subProjects = new App.Models.Projects(response.children);
        
        if( response.attributes ){
            attributes = response.attributes
        }
        else{
            attributes = response
        }

        if( attributes.parent ){
          this.parent = new App.Models.Project();
          this.parent.url = "/projects/" + attributes.parentID;
          this.parent.set('id', attributes.parentID);
          this.parent.fetch();

          this.allRelationsTo.addCollection(this.getRelationsTo());
          this.allRelationsTo.addCollection(this.parent.getRelationsTo());

          this.allRelationsFrom.addCollection(this.getRelationsFrom());
          this.allRelationsFrom.addCollection(this.parent.getRelationsFrom());

        }

        return response;
    },     
    addItem : function( item ){
        item.tag(this);
    },
    removeItem : function( item ){
        item.untag(this);
    },
    create : function( attributes ){
        if( this.subProjects ){
            return this.subProjects.create( attributes );
        }
        else{
            this.set('type','Project');
            this.save( attributes );
        }
    }, 

});

App.Models.Projects = App.Data.Collection.extend({
    model: App.Models.Project,
    /* default url is set to "projects" root - sub-projects are to be loaded recursively */
    url: "/projects"
});