'use strict';

angular.module('stklcApp').config(['$stateProvider', function ($stateProvider) {
  $stateProvider

    .state('krc', {
      url: '/krc',
      templateUrl: 'app/krc/krc.html',
      controller: 'KrcCtrl',
      controllerAs: 'ctrl',
      resolve: {
        DictionaryModel: ['DictionaryModel', function (DictionaryModel) {
          return DictionaryModel;
        }]
      }
    })

    .state('about', {
      url: '/about',
      templateUrl: 'app/about/about.html',
      controller: 'AboutCtrl',
      controllerAs: 'ctrl'
    })

    .state('test', {
      url: '/test',
      templateUrl: 'app/test/test.html',
      controller: 'TestCtrl',
      controllerAs: 'ctrl'
    })
}]);
