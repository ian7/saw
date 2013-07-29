/*global App, Backbone,_,jQuery*/

App.module("main.analytics",function(that,parentModule){
    this.Views = {};
    this.Commands = {};
    this.addInitializer( function(){
        this.context = new this.Context({ parentContext: this.parentModule.context });        

      //  this.mainView = new this.Views.IssueList({context: this.context});
        this.router = new this.Router("analytics",{context: this.context});
    });
});


