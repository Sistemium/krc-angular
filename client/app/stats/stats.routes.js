'use strict';

angular.module('stklcApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('statistics', {
        url: '/stats',
        templateUrl: 'app/stats/stats.html',
        controller: 'StatsCtrl',
        controllerAs: 'ctrl'
      });
  });
