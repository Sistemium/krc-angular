var redisAdapter = require('sails-redis');


function config (redisConfig) {

  var redisPort = redisConfig.port,
    redisHost = redisConfig.host,
    db = redisConfig.db
  ;

  console.log('Waterline Redis config:', redisHost, ':', redisPort, '/', db);

  return {

    adapters: {
      redis: redisAdapter
    },


    connections: {

      myLocalRedis: {
        adapter: 'redis',
        port: redisPort,
        host: redisHost,
        password: null,
        database: db,
        options: {
          parser: 'hiredis',
          return_buffers: false,
          detect_buffers: false,
          socket_nodelay: true,
          no_ready_check: true,
          enable_offline_queue: true
        }

      }

    },

    defaults: {
      migrate: 'alter'
    }

  };

}

module.exports = config;
