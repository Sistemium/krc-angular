'use strict';

angular.module('stklcApp')
  .controller('KrcCtrl', ['$http', '$scope', '$mdToast', '$mdSidenav',
    function ($http, $scope, $mdToast, $mdSidenav) {

    var toastPosition = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };

    var me = this;
    var localStorage = window.localStorage;

    $scope.$watchCollection('ctrl.history',function (newHistory){
        localStorage.setItem('history',JSON.stringify(newHistory));
    });

    angular.extend (me, {
      history: JSON.parse(localStorage.getItem('history')) || [],

      kirciuoti: function (word) {

        var w = _.capitalize ((word || me.wordInput|| '').toLowerCase());

        $http.get('/api/krc/' + w).success(function(data) {
          me.writeSearchedWords(w);
          me.data = data;
        }).error(function(){
          me.data = [];
          me.showSimpleToast();
        });

      },

      writeSearchedWords: function(searchedWord){
        me.duplicationRemover(searchedWord);
        me.history.unshift(searchedWord);
        me.history = _.take(me.history,20);
      },

      duplicationRemover: function(wordToCheck){
        me.history.forEach(function(item,idx){
          if (wordToCheck == item) {
            me.history.splice(idx,1);
          }
        });

      },

      showSimpleToast: function(){
        $mdToast.show(
          $mdToast.simple()
            .content('Žodis nerastas!')
            .position(me.getToastPosition())
            .hideDelay(2000)
        );
      },

      getToastPosition: function() {
        return Object.keys(toastPosition)
          .filter(function(pos) { return toastPosition[pos]; })
          .join(' ');
      },

      toggleLeft:function(){
        $mdSidenav('left-nav').toggle();
      },

      closeSideNav: function() {
        $mdSidenav('left-nav').close();
      }

    });

  }]);


