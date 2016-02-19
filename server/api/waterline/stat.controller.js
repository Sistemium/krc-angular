'use strict';

var UAParser = require('ua-parser-js');
var moment = require('moment');
var redisClient = require('../../config/redis').redisClient;
var _ = require('lodash');
var cursor = '0';
var keys = [];


module.exports.name = function (req, model, keys, data) {

  req.app.models[model].findOne(keys)
    .then (function (foundRec) {
      console.log(foundRec);
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

  var currDate = moment().format('YYYY/MM/01');
  var browserName = ua.browser.name;

  var statsSaver = function (req, model, keys, data) {

    req.app.models[model].findOne(keys)
      .then (function (foundRec) {
        console.log(foundRec);
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

  // Set of models
  //console.log('Current models are: \n');
  //Object.keys(req.app.models).forEach(function (a) {
  //  console.log((a));
  //});
  //console.log('\n');


  // Delete all models records
  // DOES NOT WORKS PROPERTLY!!!!
  //
  //req.app.models.browser.destroy({}).exec(function (err, smth) {
  //  if (err)
  //    throw err;
  //  //console.log(smth, 'ID was deleted');
  //});


  // Deleting key strings (works fine)
  // equals to .destroy function
  // more flexible because of match var

  function scan() {
    redisClient.scan(
      cursor,
      'MATCH', 'waterline:word:*',
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

  //scan();

  res.end(JSON.stringify(ua));

};



