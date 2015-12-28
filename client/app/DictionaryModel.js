'use strict';

angular.module('stklcApp')
  .service('DictionaryModel',['$http',function($http){

    var me = this;

    var formPlainDict  = function () {

      var info;
      var makePlainDict = function (obj){

        _.forOwn(obj, function(val, key){

          if (typeof(val) === 'object'){
            info = key;
            makePlainDict(val);
          }

          else{
            me.dictPlain[key] = info+': '+val;
          }

        });

      };

      makePlainDict(me.strp);

    };

    me.dictPlain = {};

    return $http.get('/api/strp/').success(function (data) {
      me.strp = data;
      formPlainDict();
    }).error(function (data, res) {
      me.errorStatus = res;
      console.log(res, 'Not found path');
    }).promise;

  }])
;
