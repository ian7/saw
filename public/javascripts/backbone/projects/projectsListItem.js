/*global App, Backbone,_,jQuery,JST*/

App.module("projects",function(){

 this.Views.ProjectItem = Backbone.Marionette.CompositeView.extend({
        events :{
            'click div.moreDetailsButton' :  'moreDetails',
            'click div.name' : 'navigateProject'
        },
        template: JST['projects/projectsListItem'],
        templateHelpers: {
       /*     get: function( variable ){
                try {
                    if( this[variable] ){
                        return this[variable];
                    }
                    else{
                        return "(empty)";
                    }
                }
                catch( e ){
                    return ("(undefined)");
                }

            },*/
            getIssueCount : function(){
                try {
                    if( this.attributes.data && this.attributes.data.issueCount ) {
                        return this.attributes.data.issueCount;
                    }
                    else{
                        return 0;
                    }
                }
                catch( e ){
                    return 0;
                }
            },
            getId : function(){
                try{
                    if( this.id ){
                        return this.id;
                    }
                    else{
                        return 0;
                    }
                }
                catch( e ){
                    return 0;
                }
            }
        },
        tagName: "div",
        
        initialize: function(){
            // grab the child collection from the parent model
            // so that we can render the collection as children
            // of this parent node

            this.collection = this.model.subProjects;
            this.model.on('change',this.updateSubs,this);
            //this.model.on('change',this.render,this);
            this.model.trigger('change');
            this.itemViewOptions = {context: this.context};
        },
        updateSubs : function(){
            this.collection = this.model.subProjects;
            //this.render();
        },
        appendHtml: function(collectionView, itemView){
            // ensure we nest the child list inside of 
            // the current list item
    //        collectionView.$("li:first").append(itemView.el);
            jQuery(collectionView.$("div.subProjects")[0]).append(itemView.el);
            //jQuery(collectionView.el).append(itemView.el);
        },
        moreDetails : function(e){
            // prevents recursive selctor havoc
            if( e.srcElement.id !== this.model.get('id')){
                return;
            }
            
            var md = jQuery("div.moreDetails",this.el).eq(0);
            md.hide();
            md.slideDown(300);
            
        },
        navigateProject : function(e) {

            /* that's old and lame...
            // if root element was clicked, then just navigate back to nowhere
            if( e.srcElement.parentElement.id === 0){
                window.location.hash="";
                return;
            }
            // prevents recursive selctor havoc
            if( e.srcElement.parentElement.id !== this.model.get('id')){
                return;
            }
            window.location.hash="projects/"+this.model.get('id');
            //app.navigate("projects/"+this.model.get('id'));
            */
            this.context.dispatchToParent("project:selected",{id: this.model.get('id')});
        }
    });
    this.Views.ProjecDetailsWidget = Backbone.Marionette.ItemView.extend({
        template: JST['projects/projectsList'],
        className: 'projectDetailsWidget',
        templateHelpers: {
            get : function( id ){
                if( this[id] ){
                    return(this[id]);
                }
                else{
                    return("(empty)");
                }
            }
        },
        events: {
        },
        initialize : function(){
            //this.projects = new Backbone.Model();
            this.model = new App.Models.Project();
            this.model.url = "/projects/"+this.id;
            this.model.id = this.id;
            this.model.fetch();
            _(this).bindAll();
            
            // (re)render after thigs are loaded....
            // this needs to be changed into this.refresh()
            this.model.on("change",this.render);

            this.items_collection = new App.Models.Items();  
            this.items_collection.urlOverride = this.model.url + "/items";
            this.items_collection.fetch();
            this.itemListView = new App.Views.IssueList({collection: this.items_collection });
        },
        // this is executed after template is alreayd rendered
        onRender: function(){
            // this we can leave out for later
            //this.sidebarView = new App.Views.ProjectSidebar({ el: this.sidebarEl });      

            this.itemListView.$el = jQuery( "div.issueListHolder", this.el);
            this.itemListView.render();
        },
        refresh: function(){

        }
    });
});