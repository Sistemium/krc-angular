'use strict';

angular.module('stklcApp')
  .service('WordService',['$http',function($http){

    var me = this;

    angular.extend (me,{
      history: JSON.parse(localStorage.getItem('history')) || [],
      clearHistory: function () {
        localStorage.removeItem('history');
        me.history.splice(0, me.history.length);
      }
    });


    var duplicationRemover = function (wordToCheck) {
      me.history.forEach(function (item, idx) {
        if (wordToCheck == item) {
          me.history.splice(idx, 1);
        }
      });

    };

    var writeSearchedWords = function (searchedWord) {
      duplicationRemover(searchedWord);
      me.history.unshift(searchedWord);
      me.history.length && localStorage.setItem('history', JSON.stringify(me.history));
      me.history.splice(20, me.history.length);
    };

    me.getWordData = function (word) {
      var q = $http.get('/api/krc/' + word);
      return q.success(function(res){
        writeSearchedWords(word);
      });

    };


  }]);
