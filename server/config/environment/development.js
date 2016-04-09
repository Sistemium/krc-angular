'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // Redis connection options
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    db: process.env.REDIS_DATABASE || 1
  },
  STAPI: 'https://api.sistemium.com/v4d/krc/'
};
