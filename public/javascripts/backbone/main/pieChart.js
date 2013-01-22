/*global App,Backbone,JST,_,jQuery,google */
 
App.module('main',function(){
    this.Views.PieChart = Backbone.Marionette.ItemView.extend({
        className : 'pieChart',
        tagName : 'div',
        template : JST['main/pieChart'],
        events : {
        },
        data : [
            ],
        header : ["Item","Value"],
        options : {
//            title: 'Pie Chart'
        },
        initialize : function(){
            _(this).bindAll();
        },  
        onRender : function(){
            var rawChartData = [];

            rawChartData.push( this.header );
            _(this.data).each( function( row ) {
                rawChartData.push( row );
            },this);

            var chartData = google.visualization.arrayToDataTable( rawChartData );

            this.options.width = 800;
            this.options.height = 400;


            this.chart = new google.visualization.PieChart(this.el);
            this.chart.draw(chartData,this.options);
        }
    });
});