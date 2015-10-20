'use strict';

angular.module('stklcApp')
  .controller('KrcCtrl', function ($http) {

    var me = this;
    angular.extend (me, {

      kirciuoti: function (word) {

        var w = word || me.wordInput;

        $http.get('/api/krc/' + w).success(function(data) {
          me.data = data;
          me.errMsg ='';
        }).error(function(){
          me.data = [];
        });

      },

      wordInput: ''

    });




  });


