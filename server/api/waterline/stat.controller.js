'use strict';

var UAParser = require('ua-parser-js');
var moment = require('moment');
var redisClient = require('../../config/redis').redisClient;
var _ = require('lodash');
var cursor = '0';
var async = require('async');


module.exports.name = function (req, model, keys, data) {

  req.app.models[model].findOne(keys)
    .then (function (foundRec) {
      if (!foundRec) {
        return req.app.models[model]
          .create (_.assignIn(keys, data))
          .then (function (newRec) {
            return newRec.save();
          })
          .catch (console.error);
      } else {
        foundRec.cnt++;
        return foundRec.save()
      }

    });

};


exports.index = function (req, res) {

  var ua = UAParser(req.headers['user-agent']);

  var currDate = moment().format('YYYY/MM/DD');
  var browserName = ua.browser.name;

  var statsSaver = function (req, model, keys, data) {

    req.app.models[model].findOne(keys)
      .then (function (foundRec) {
        if (!foundRec) {
          return req.app.models[model]
            .create (_.assignIn(keys, data))
            .then (function (newRec) {
              return newRec.save();
            })
            .catch (console.error);
        } else {
          foundRec.cnt++;
          return foundRec.save()
        }

      });

  };


  statsSaver(req, 'usercount', {date: currDate}, {cnt: 1});
  statsSaver(req, 'browsercount', {browser: browserName}, {cnt: 1});

  // Set of models test

  //console.log('Current models are: \n');
  //Object.keys(req.app.models).forEach(function (a) {
  //  console.log((a));
  //});
  //console.log('\n');


  // Deleting key strings (works fine)
  // equals to .destroy function
  // more flexible because of match parameter

  function scan() {
    redisClient.scan(
      cursor,
      'MATCH', 'waterline:wordcount:*',
      'COUNT', '100',
      function (err, res) {
        if (err) throw err;

        cursor = res[0];
        keys.push(res[1]);

        if (cursor === '0') {

          keys = _.flattenDeep(keys);

          // if nothing to delete console.log msg else delete

          if (keys.length > 0) {
            redisClient.DEL(keys, function (err, res) {
              if (err) throw err;
              console.log(res, 'records were deleted');
            });
          }
          else {
            console.log('There is nothing to delete');
          }

          return console.log('Iteration complete');
        }

        return scan();
      }
    );
  }

  res.end(JSON.stringify(ua));

};


exports.stats = function (req, res) {

  var responseData = {};
  var modelNames = Object.keys(req.app.models);


  async.each(modelNames, function (modelName, doneModel) {

    var primaryKey = req.app.models[modelName].primaryKey;
    var modelKey = 'waterline:' + modelName + ':' + primaryKey;

    responseData [modelName] = [];


    redisClient.SMEMBERS([modelKey], function (err, keys) {

      if (err) {
        doneModel(err);
      }

      async.each(keys, function (key, doneKey) {

        redisClient.GET([key], function (err, data) {

          if (err) {
            doneKey(err);
          }

          responseData [modelName].push(JSON.parse (data));

          doneKey();

        })
      }, function (err) {
        if (err) {
          return doneModel(err);
        }

        if (primaryKey != 'browser') {
          responseData [modelName] = _.sortBy (responseData [modelName], primaryKey);
        } else {
          responseData [modelName] = _.sortBy (responseData [modelName], 'cnt');
        }

        doneModel();
      });

    });

  }, function (err) {

    if (err)
      throw err;
    else {
      res.json (responseData);
    }

  });

};



