'use strict';

var express = require('express');
var controller = require('./krc.controller');

var router = express.Router();

router.get('/:word', controller.index);
router.get('/', function(req, res){

});



module.exports = router;
