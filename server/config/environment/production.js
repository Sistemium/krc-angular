'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  // Redis connection options
  redis: {
    host: process.env.REDIS_HOST, // || host string
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DATABASE
  }
};
