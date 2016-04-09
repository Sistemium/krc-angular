'use strict';
var request = require('request');
var fs = require('fs');

exports.index = function (req, res) {
  console.log('you\'re on strp page');

  fs.readFile('server/api/strp/strp.json', 'utf8', function (err, data) {

    if (err) throw err;

    res.json(JSON.parse(data));

  });

};


