angular.module ('stklcApp')
  .service ('StatsModel', function ($http) {

    function seriesChartData (apiData, series) {

      var res = {
        labels: [],
        series: _.map (series,function () { return []; })
      };

      _.each (apiData, function (row) {

        res.labels.push (row.date);

        _.each (series, function (serie,idx) {
          res.series [idx].push (row[serie] || 0);
        });

      });

      return res;

    }

    function noSeriesChartData (apiData, key) {

      var res = {
        labels: [],
        values: []
      };

      _.each (apiData, function (row) {

        res.labels.push (row [key || 'date']);
        res.values.push (row.cnt);

      });

      return res;

    }

    function getStats () {

      return $http.get('api/stats/getStats')
        .then(function (json) {

          var result = {};
          var data = json.data;

          result.browserStats = noSeriesChartData (data.browsercount, 'browser');
          result.userStats = noSeriesChartData (data.usercount);
          result.userStats.values = [result.userStats.values];

          _.each (data.foundwordcount, function (d){
            d.foundCnt = d.cnt;
          });

          _.each (data.notfoundwordcount, function (d){
            d.notFoundCnt = d.cnt;
          });

          var wordsData = data.foundwordcount.concat(data.notfoundwordcount);

          wordsData = _.groupBy (wordsData,'date');

          wordsData = _.map (wordsData, function (val,key) {
            return {
              date: key,
              foundCnt: _.get (_.find (val,'foundCnt'),'foundCnt'),
              notFoundCnt: _.get (_.find (val,'notFoundCnt'),'notFoundCnt')
            };
          });

          result.wordStats = seriesChartData(wordsData,['foundCnt','notFoundCnt']);

          return result;

        })
      ;
    }

    return {
      getStats: getStats
    };

  });
