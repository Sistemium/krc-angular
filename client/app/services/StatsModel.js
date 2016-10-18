angular.module ('stklcApp')
  .service ('StatsModel', ['$http', '$window', function ($http) {

    // Word count graph

    function seriesChartData(apiData, series) {

      var res = {
        labels: [],
        series: _.map (series, function () {
          return [];
        })
      };

      _.each (apiData, function (row) {

        res.labels.push (row.date);

        _.each (series, function (serie, idx) {
          res.series [idx].push (row[serie] || 0);
        });

      });

      return res;

    }

    function noSeriesChartData(apiData, key, divider) {


      var res = {
        labels: [],
        values: [],
        percentage: []
      };

      _.each (apiData, function (row) {

        res.labels.push (row [key || 'date']);
        res.values.push (row.cnt);

      });

      //percentages for pie chart

      if (key == 'browser') {

        var total = res.values.reduce(function (a, b) {
          return a + b;
        });

        res.values.forEach(function (elem, i) {
          res.labels[i] +=' ' + ((elem / total) * 100).toFixed(1) + '%';
        });
      }



      if (divider) {
        var groupData = [];
        var groupLabels = [];
        var newLabels = [];
        var cnt = 0;


        // while res.values || res.labels, because res.values == res.labels

        while ((res.values.length > 0)) {
          groupData[cnt] = res.values.splice(0, divider);
          groupLabels[cnt] = res.labels.splice(0, divider);
          cnt++;
        }


        //Calculating the average and rounding.

        groupData.forEach(function (values) {
          res.values.push(Math.round(values.reduce(function (sum, a) {
              return sum + a
            }) / (values.length || 1)));
        });

        // Forming new labels
        groupLabels.forEach(function (labels, idx, array) {

          if (idx === array.length - 1) {
            newLabels = [_.last(labels).slice(2, labels[0].length)];
          } else {
            newLabels = [_.head(labels).slice(2, labels[0].length)];
          }

          res.labels.push(newLabels);

        })


      }

      return res;

    }

    function getStats() {

      return $http.get('api/stats/getStats')
        .then(function (json) {
          var result = {};
          var labelSize = ((innerWidth * 1.5) / 100).toFixed();
          var data = json.data;
          var divider;
          resizeChart();

          function resizeChart() {

            labelSize = ((innerWidth * 1.5) / 100).toFixed();
            divider = Math.ceil((data.usercount.length) / labelSize);

            if (divider > 1) {
              result.userStats = noSeriesChartData(data.usercount, '', divider);
              result.userStats.values = [result.userStats.values];

            } else {
              result.userStats = noSeriesChartData(data.usercount);
              result.userStats.values = [result.userStats.values];
            }

          }

          result.browserStats = noSeriesChartData(data.browsercount, 'browser');

          _.each (data.foundwordcount, function (d) {
            d.foundCnt = d.cnt;
          });

          _.each (data.notfoundwordcount, function (d) {
            d.notFoundCnt = d.cnt;
          });

          var wordsData = data.foundwordcount.concat(data.notfoundwordcount);


          wordsData = _.groupBy (wordsData, 'date');

          wordsData = _.map (wordsData, function (val, key) {
            return {
              date: key,
              foundCnt: _.get (_.find (val, 'foundCnt'), 'foundCnt'),
              notFoundCnt: _.get (_.find (val, 'notFoundCnt'), 'notFoundCnt')
            };
          });

          wordsData = _.sortBy(wordsData,'date');

          wordsData = _.takeRight(wordsData, 60);

          result.wordStats = seriesChartData(wordsData, ['foundCnt', 'notFoundCnt']);

          return result;

        });
    }

    return {
      getStats: getStats
    };

  }]);
