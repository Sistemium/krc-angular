/**
 * Created by DenisMosin on 12/02/16.
 */



var redisClient = require('../../config/redis').redisClient,
    redisConfig = require('../../config/environment/index'),
    redisAdapter = require('sails-redis');


//Config
//Require redisClient and redisConfig

var port = redisClient.connection_options.port,
    host = redisClient.connection_options.host,
    dbType = redisConfig.env,
    connectionId = redisConfig.redis[dbType];

//console.log('Port is:',port,'\n' + 'Host is:',host,'\n' + 'DB type is:',dbType,'\n' + 'Connection ID is:',connectionId);

var config = {

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

};

module.exports = config;
