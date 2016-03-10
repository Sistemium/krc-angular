/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
var _ = require('lodash');


// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./config/redis').config(app);
require('./routes')(app);

var Waterline = require('waterline');
var orm = new Waterline();
var waterCollection = require ('./api/waterline/models');
var waterConfig = require ('./config/waterline.config') (config.redis);


_.forOwn(waterCollection, function(value) {
  orm.loadCollection(value);
});

// Start server + waterline
orm.initialize(waterConfig, function (err, models) {

  if (err) {
    throw err;
  }

  app.models = models.collections;
  app.connections = models.connections;

  server.listen(config.port, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });

});

// Expose app
exports = module.exports = app;
