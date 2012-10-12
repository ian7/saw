/*global App, Backbone,_*/

App.module("main",function(){
    this.startWithApp = true;
    this.Views = {};
    this.Commands = {};
    this.Regions = {};
    this.addInitializer( function(){
        this.layout = new this.Views.Layout();
        this.context = this.layout.context;
        this.layout.start();
    });
});