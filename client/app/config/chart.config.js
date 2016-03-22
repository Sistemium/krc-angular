/**
 * Created by DenisMosin on 08/03/16.
 */

angular.module('stklcApp')
  .config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      colours: ['#FF5252', '#FFAAFF'],
      responsive: true
    });
    // Configure Line charts
    ChartJsProvider.setOptions('Line', {
      colours: ['#1700AA'],
      bezierCurve : false
    });
    // Config Pie chart
    ChartJsProvider.setOptions('Pie', {
      colours: ['#5d48d6', '#e16d8d'],
      segmentStrokeWidth: 0,
      segmentStrokeColor: "#fff"
    });
    // Config Bar chart
    ChartJsProvider.setOptions('Bar', {
      colours: ['#1700AA', '#AA0330'],
      segmentStrokeWidth: 0
    });

  }])
;
