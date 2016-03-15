'use strict';

angular.module('stklcApp')

  .controller('StatsCtrl', ['StatsModel', function (StatsModel) {

    var me = this;

    angular.extend (me, {

      getStats: function () {
        me.showCharts = false;
        StatsModel.getStats().then (function (res){
          me.showCharts = true;
          angular.extend (me,res);
        });
      },

      scrolling: function(){


      }


    });

    me.getStats();

    $scope.setSubNavs([
      {name: 'krc', title: 'Ref. Stats', clickFn: me.getStats}
    ]);


  }])
;


