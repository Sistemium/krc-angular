'use strict';

angular.module('stklcApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('words', {
        url: '/words',
        templateUrl: 'app/words/words.html',
        controller: 'WordsCtrl',
        controllerAs: 'ctrl'
      });
  });
