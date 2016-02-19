'use strict';

var path = require('path');
var _ = require('lodash');

var redisClient = require('../../config/redis').redisClient,
  redisAdapter = require('sails-redis');

var port = redisClient.connection_options.port,
  host = redisClient.connection_options.host,
  connectionId = redisClient.connection_id;

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'stklc-secret'
  },

  // Redis connection options
  redis: {
    production: process.env.REDIS_DATABASE || 0,
    development: process.env.REDIS_DATABASE || 1,
    test: process.env.REDIS_DATABASE || 2
  },

  waterline: {
    adapters: {
      redis: redisAdapter
    },

    connections: {

      myLocalRedis: {
        adapter: 'redis',
        port: port,
        host: host,
        password: null,
        database: connectionId,
        options: {
          parser: 'hiredis',
          return_buffers: false,
          detect_buffers: false,
          socket_nodelay: true,
          no_ready_check: false,
          enable_offline_queue: true
        }

      }

    },

    defaults: {
      migrate: 'alter'
    }

  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
