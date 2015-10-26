'use strict';

angular.module('stklcApp')
  .controller('KrcCtrl', function ($http, $scope, $mdToast, $mdSidenav) {

    var toastPosition = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };

    var me = this;

    angular.extend (me, {
      history: [],
      kirciuoti: function (word) {

        var w = word || me.wordInput;
        $http.get('/api/krc/' + w).success(function(data) {
          me.writeSearchedWords(w);
          me.data = data;
        }).error(function(){
          me.data = [];
          me.showSimpleToast();
        });

      },

      writeSearchedWords: function(searchedWord){
        if(me.history.length < 10){
          me.history.push({word: searchedWord});
        }
        else{
          me.history.shift();
          me.history.push({word: searchedWord});
        }
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
      },

      wordInput: 'Mama',

    });

  });


