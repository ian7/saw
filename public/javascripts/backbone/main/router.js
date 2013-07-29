/*global App,Backbone,JST,_,jQuery */
App.module('main',function(){
    this.Router = Backbone.Router.extend({
    routes: {
        '*everything' :            "index",
    },
    initialize : function(){
        },
    index: function( options ) {         
    	var segments = options.match(/[\w.]+\/[\w.]+/g);
    	var viewState = {};
    	for( var segmentId in segments ){
    		var segment = segments[segmentId];
    		var key = segment.substring(0,segment.indexOf('/'));
    		var value = segment.substring(segment.indexOf('/')+1);
    		viewState[key] = value;
	    	}
        App.main.context.dispatchGlobally('history:pop',viewState);
        },
    });
});
