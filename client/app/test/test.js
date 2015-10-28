'use strict';

angular.module('stklcApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.about.test', {
        url: '/test',
        templateUrl: 'app/test/test.html',
        controller: 'TestCtrl'
      });
  });
