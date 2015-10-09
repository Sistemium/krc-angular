'use strict';

angular.module('stklcApp')
  .controller('KrcCtrl', function ($http) {

    var me = this;
    var errMsg = '';
    angular.extend (me,{

      kircuoti: function (word) {

        var w = word || me.wordInput;

        $http.get('/api/krc/' + w).success(function(data) {
          me.data = data;
          me.errMsg ='';
        }).error(function(){
          me.data = [];
          me.errMsg = 'Word not found';
        });

      },

      wordInput: 'qwew'

    });

  });
