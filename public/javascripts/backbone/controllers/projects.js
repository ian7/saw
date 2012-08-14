/**
 * @author Marcin Nowak
 */

Project = Backbone.Model.extend({
    initialize : function( model ){
      //this.attributes.id = 0;
      if( model ) {
        this.parse( model );
      }
    },
    parse: function( response ){
        this.id = response.id;
        // this converts simple children entry into the collections - 
        this.subProjects = new ProjectCollection(response.children);
        return response;
    }        
});

ProjectCollection = Backbone.Collection.extend({
    model: Project,
});

App.Views.ProjectView = Backbone.Marionette.CompositeView.extend({
    events :{
        'click div.moreDetailsButton' :  'moreDetails',
        'click div.name' : 'navigateProject',
    },
    template: "#node-template",
    templateHelpers: {
        get: function( variable ){
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

        },
        getIssueCount : function(){
            try {
                if( this.data && this.data.issueCount ) {
                    return this.data.issueCount;
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
        if( e.srcElement.id != this.model.get('id')){
            return;
        }
        
        var md = jQuery("div.moreDetails",this.el).eq(0);
        md.hide();
        md.slideDown(300);
        
    },
    navigateProject : function(e) {

        // if root element was clicked, then just navigate back to nowhere
        if( e.srcElement.parentElement.id == 0){
            window.location.hash="";
            return;
        }
        // prevents recursive selctor havoc
        if( e.srcElement.parentElement.id != this.model.get('id')){
            return;
        }
        window.location.hash="projects/"+this.model.get('id');
        //app.navigate("projects/"+this.model.get('id'));
    }
});

App.Views.ProjectListWidget = Backbone.Marionette.ItemView.extend({
    template: "#projectListWidgetTemplate",
    events: {
        'click div#newProjectButton' :  'newProject',
    },
    initialize : function(){
        //this.projects = new Backbone.Model();
        this.projects = new Project();
        this.projects.url = "/";
        this.projects.fetch();
    },
    // this is executed after template is alreayd rendered
    onRender: function(){
        rootView = new App.Views.ProjectView({ model: this.projects,el: jQuery('div.projectView',this.el) });
        // render after thigs are loaded....
        rootView.model.on("change",function(){this.render()},rootView);
    },
    newProject : function(){
        jQuery("#newProjectModal").modal('show');

    }
});


App.Views.ProjecDetailsWidget = Backbone.Marionette.ItemView.extend({
    template: "#projectDetailsWidgetTemplate",
    className: 'projectDetailsWidget',
    templateHelpers: {
        get : function( id ){
            if( this[id] ){
                return(this[id]);
            }
            else{
                return("(empty)");
            }
        },
    },
    events: {
    },
    initialize : function(){
        //this.projects = new Backbone.Model();
        this.model = new Project();
        this.model.url = "/projects/"+this.id;
        this.model.fetch();
        _(this).bindAll();
        
        // (re)render after thigs are loaded....
        // this needs to be changed into this.refresh()
        this.model.on("change",function(){this.render()},this);

        this.items_collection = new Items;  
        this.items_collection.urlOverride = this.model.url + "/items";
        this.items_collection.fetch();
        this.itemListView = new App.Views.IssueList({collection: this.items_collection });                     

    },
    // this is executed after template is alreayd rendered
    onRender: function( ){

        // this we can leave out for later
        //this.sidebarView = new App.Views.ProjectSidebar({ el: this.sidebarEl });      

        this.itemListView.$el = jQuery( "div.issueListHolder", this.el);
        this.itemListView.render();
    },
    refresh: function(){

    },
});

App.Views.RibbonWidget = Backbone.View.extend({
    className : 'ribbonWidget',
    initialize : function(){
        // hook up to the routing events
        Backbone.history.on('route',this.render,this);

        _(this).bindAll();
    },  
    render : function(){
        h = "";
        h += "<a href='#'>Home</a>";

        try {
            if( app && app.context && app.context.project ){
                h += " &gt; <a href='#projects/" + app.context.project.id + "'>";

                // if there is no name defined
                var projectName = app.context.project.get('name');
                if( projectName == null ){
                    h += "(...)";
                    app.context.project.on('change',this.render,this);
                    //this.bindRenderChange( app.context.project );
                }
                else {
                    app.context.project.off('change',this.render,this);
                    h += projectName;
                }
                h += "</a>";
            }

            if( app && app.context && app.context.issue && app.context.project){

                // if there is no name defined
                var projectName = app.context.project.get('name');
                if( projectName == null ){
                    app.context.project.on('change',this.render,this);
                }
                else{
                    app.context.project.off('change',this.render,this);
                }

                h += " &gt; <a href='#projects/" + app.context.project.id + "/issues/" + app.context.issue.id + "'>";
                var issueName = app.context.issue.get('name');
                if( issueName == null ){
                    h += "(...)";
                    app.context.issue.on('change',this.render,this);
                }
                else {
                    app.context.issue.off('change',this.render,this);
                    h += issueName;
                }
                h += "</a>";
            }

        }
        catch( e ){
            console.log( "ribbon crashed on project")

        }
        jQuery(this.el).html( h );
    },
});


App.Controllers.Project = Backbone.Router.extend({
    routes: {
        "" :            "index",
        "projects/:id" : "projectDetails",
        "issues/:id" : "issueDetails",
        "projects/:projectId/issues/:issueId/alternatives" : "projectIssueAlternatives",
    },

	initialize : function(){
		// this nicely finds project id
		if( window.location.pathname.match('projects') ) {
			this.projectid = window.location.pathname.match('projects\/.*$')[0].substring(9,33);
		}		
        ribbonView = new App.Views.RibbonWidget();
        layout.ribbon.show( ribbonView );

	},
    reset : function(){
        layout.content.reset();

        // here we're going to persist navigation context for now. 
        this.context = {};
    },
    index: function() {  		
        this.reset();
        rootView = new App.Views.ProjectListWidget();

        layout.content.show( rootView );
    },
    projectDetails : function(id) {
        this.reset();

        detailsView = new App.Views.ProjecDetailsWidget({id:id});

        // let's see how this works
        this.context.project = detailsView.model;

        layout.content.show( detailsView );  
    },
    issueDetails : function( id ){
        this.reset();

        this.issueId = id;
        detailsView = new App.Views.IssueDetails({id:id});

        this.context.issue = detailsView.model;

        layout.content.show( detailsView );  
    },
    projectIssueAlternatives : function( projectId, issueId ){
        this.reset();

        detailsView = new App.Views.AlternativeDetailsWidget({projectId:projectId, issueId:issueId});

        this.context.project = detailsView.project;
        this.context.issue = detailsView.issue;

        layout.content.show( detailsView );          
    }
});





AppLayout = Backbone.Marionette.Layout.extend({
  template: "#my-template",
  el: jQuery("div#main"),
  regions: {
    ribbon: "#ribbon",
    content: "#center",
    leftSidebar: "#leftSidebar",
    rightSidebar: "#rightSidebar",
    modal: "#modal",
  }
});

var layout = new AppLayout();
layout.render(); 



