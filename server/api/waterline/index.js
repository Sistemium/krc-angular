'use strict';

var express = require('express'),
  controller = require('./stat.controller'),
  router = express.Router();


router.get('/', controller.index);

module.exports = router;


