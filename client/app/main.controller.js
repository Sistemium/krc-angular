'use strict';

angular.module('stklcApp')
  .controller('MainCtrl', ['$scope', function ($scope) {

    var me = this;

    angular.extend(me,{

      navs: [
        { name: 'krc', title: 'Kirčiavimo programa', sref: 'krc', icon: 'action:exit_to_app'},
        { name: 'about', title: 'Apie projektą', sref: 'about', icon: 'action:question_answer'}
      ],

      openMenu: function($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
      }

    });

    $scope.setSubNavs = function(navs) {
      me.subNavs = navs || [];
    };

    $scope.$on('$stateChangeSuccess', function() {
      $scope.setSubNavs();
    });

  }]);
