/*global App, Backbone,_*/

App.module("main",function(){
    this.startWithApp = true;
    this.Views = {};
    this.Commands = {};
    this.Regions = {};
    this.start = function(){
        this.layout = new this.Views.Layout();
        this.layout.start();
    };
});