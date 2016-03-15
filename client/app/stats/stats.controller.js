'use strict';

angular.module('stklcApp')

  .controller('StatsCtrl', ['StatsModel', '$scope', function (StatsModel, $scope) {

    var me = this;


    angular.extend (me, {

      getStats: function () {
        me.showCharts = false;
        StatsModel.getStats().then (function (res){
          me.showCharts = true;
          angular.extend (me,res);
        });
      },

    });

    me.getStats();

    $scope.setSubNavs([
      {name: 'krc', title: 'Ref. Stats', clickFn: me.getStats}
    ]);


  }])
;


