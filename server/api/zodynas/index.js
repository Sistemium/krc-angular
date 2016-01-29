'use strict';

var express = require('express');
var controller = require('./zodynas.controller');

var router = express.Router();

router.get('/:word', controller.index);
router.post('/', controller.post);

router.get('/', function(req, res){
  res.status(400).end('Wrong input');

});

module.exports = router;
