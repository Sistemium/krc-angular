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
};



