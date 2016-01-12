'use strict';
var request = require('request'),
  fs = require('fs'),
  redisClient = require('../../config/redis').redisClient;
var DICTIONARY_KEY ='test_db_final';
var readline = require('linebyline');

exports.index = function(req, res) {

  console.log('you\'re on zodynas page');

  var data = req.params.word.toLowerCase();
  console.log(data);

  redisClient.ZRANGEBYLEX([DICTIONARY_KEY, '[' + data, '[' + data + 'ž', 'LIMIT', '0', '20' ],
    function (err, response) {
      if (err) throw err;
      var asd = response;
      res.send(asd);
    }
  );

};


exports.post = function (req,res) {

  var fileName ='tmp.txt';

  var finish = function () {
    console.log('\n' + wrongCount + ' words didn\'t match RegExp');
    fs.unlink(fileName,function(){
      console.log (fileName, 'deleted');
    });

  };

  var wrongCount = 0;

  var processLine = function (line, lineCount) {

    // if a letter and not other symbol
    if (line && !line.match(/[^a-ząčęėįšųūž]/ig)) {

      redisClient.ZADD(DICTIONARY_KEY, 0, line.toLowerCase(), function(err, reply){
        if (err)
          throw err;

        if (reply == 0){
          var e = 'Word: ' + line + ' was overwritten';
          console.log(e);

        }
      });

    }
    else{
      wrongCount++;
    }
    return wrongCount;
  };

  var stream = req.pipe(fs.createWriteStream(fileName));

  stream.on('error',finish);

  stream.on('finish',function(){

    var rl = readline('tmp.txt');

    rl.on('line', processLine);

    rl.on('close',function () {
      finish();
      res.end();
    });

    rl.on('error', function(err) {
      finish();
      res.end(err);
    });

  })
};
