'use strict';

angular.module('stklcApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.about', {
        url: 'about',
        templateUrl: 'app/about/about.html',
        controller: 'AppCtrl'
      });
  });


