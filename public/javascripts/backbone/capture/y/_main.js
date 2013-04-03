/*global App, Backbone,_,jQuery*/

App.module("main.capture.y",function(that,parentModule){
    this.Views = {};
    this.Commands = {};
    this.addInitializer( function(){
        this.context = new this.Context({ parentContext: this.parentModule.context });        
        //this.router = new this.Router("capturey",{context: this.context});
    });
});


