'use strict';
var redis = require('redis');
var config = require('./environment');
var redisClient = redis.createClient(config.redis);

exports.config = function (app) {
  redisClient.select(app.get('redisdb'), function (err) {
    if (err) throw new Error(err);
    console.log('Redis client connected to db %s', app.get('redisdb'));
  });

  redisClient.on('error', function (err) {
    console.log('Error ' + err);
  });

  return redisClient;
};

exports.redisClient = redisClient;

