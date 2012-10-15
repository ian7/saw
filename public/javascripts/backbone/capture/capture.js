/*global App, Backbone,_,jQuery*/

App.module("main.capture",function(that,parentModule){
    this.startWithApp = false;
    this.Views = {};
    this.Commands = {};
    this.addInitializer( function(){
        this.context = new this.Context({ parentContext: this.parentModule.context });        
        this.region = this.context.region = new Backbone.Marionette.Region({el:'div#layout div#trunk div#center'});

      //  this.mainView = new this.Views.IssueList({context: this.context});
        this.router = new this.Router("capture",{context: this.context});
    });
});


