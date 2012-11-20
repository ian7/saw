/*global App, Backbone,_*/

App.module("main.mockups",function(){
    this.startWithApp = true;
    this.Views = {};
    this.Commands = {};
    this.addInitializer( function(){
        //this.layout = new this.Views.Layout();
        //this.context = this.layout.context;
        this.context  = App.main.context;
        //this.layout.start();
        this.router = new this.Router("mockups",{context: this.context});
    });
});