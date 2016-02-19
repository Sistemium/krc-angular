'use strict';

angular.module('stklcApp')
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {

    var me = this;

    angular.extend(me, {

      navs: [
        {name: 'krc', title: 'Kirčiavimo programa', sref: 'krc', icon: 'action:exit_to_app'},
        {name: 'about', title: 'Apie projektą', sref: 'about', icon: 'action:question_answer'}
      ],

      openMenu: function ($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
      }

    });

    $scope.setSubNavs = function (navs) {
      me.subNavs = navs || [];
    };

    $scope.setLeftPart = function (part) {
      me.leftPart = part;
    };

    $scope.$on('$stateChangeSuccess', function () {
      $scope.setSubNavs();
      $scope.setLeftPart();
    });

    $scope.disableScroll = function (arg) {
      $scope.scrollDisabled = !!arg;
    };

    $http.get('/api/stats');

  }]);
