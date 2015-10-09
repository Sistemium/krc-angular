'use strict';

angular.module('stklcApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/krc/krc.html',
        controller: 'KrcCtrl',
        controllerAs: 'ctrl'
      });
  });
