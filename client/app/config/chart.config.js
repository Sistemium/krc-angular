/**
 * Created by DenisMosin on 08/03/16.
 */

angular.module('stklcApp')
  .config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      colours: ['#FF5252', '#FFAAFF'],
      pointDot: true,
      responsive: true,
    });
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
      scaleShowVerticalLines: true,
      colours: ['#AA0330', '#1700AA']
    });
    // Config pie chart
    ChartJsProvider.setOptions('Doughnut', {
      datasetFill: true
    });
  }])
;
