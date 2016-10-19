'use strict';

var path = require('path');
var _ = require('lodash');

var env = process.env || {};

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: env.PORT || 9000,

  // Server IP
  ip: env.IP || '0.0.0.0',

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'stklc-secret'
  },

  STAPI: env.STAPI,
  HTTP_TIMEOUT: env.HTTP_TIMEOUT || 5000

};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + env.NODE_ENV + '.js') || {});
