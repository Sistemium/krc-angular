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
      colours: [
        '#7180b4',
        '#4e4f8d',
        '#4C97B1',
        '#934A5F',
        '#57648C',
        '#7A6F88',
        '#5D7085',
        '#515151',
        '#4A36C8',
        '#B63457'
      ],
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
