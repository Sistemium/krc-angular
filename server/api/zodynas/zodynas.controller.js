'use strict';
var request = require('request');
var fs = require('fs');
var redisClient = require('../../config/redis').redisClient;

var DICTIONARY_KEY ='mixed_accent_words';
var ACCENTUATED_WORDS = 'accentuated_words';

// For tests
//ACCENTUATED_WORDS = 'test_accentuated_words';
//DICTIONARY_KEY ='test_mixed_accent_words';

var readline = require('linebyline');
var debug = require('debug') ('krc:zodynas.controller');
var async = require ('async');
var _ = require ('lodash');


exports.index = function(req, res) {

  var word = req.params.word.toLowerCase();

  //debug ('index', 'word:', word);

  var response = [];
  var accentuatedWordsSplit;

  redisClient.ZRANGEBYLEX([DICTIONARY_KEY, '[' + word, '[' + word + 'ž', 'LIMIT', '0', '60' ],
    function (err, accentlessWords) {

      if (err) throw err;

     //debug('index', 'accentlessWords:', accentlessWords);

      async.each (accentlessWords, function (accentlessWord, done){
        redisClient.HGET([ACCENTUATED_WORDS, accentlessWord], function(err, accentuatedWords){
          if (err) {
            done (err);
          }

         //debug('index', 'ACCENTUATED_WORDS:', accentlessWord, accentuatedWords);

          if (accentuatedWords){

            accentuatedWordsSplit = accentuatedWords.split(',');

            accentuatedWordsSplit.forEach(function(word){
              response.push(word);
            });

          } else {

            response.push(accentlessWord);

          }

          done();

        });
      }, function (err){
        if (err){
          throw err;
        } else {
          var sorted = _.uniq(response).sort(lcompare);
          sorted.splice(40);
          res.json(sorted);
        }
      });

    }
  );

};

var lcompare = function (a,b) {

  var res = 0;

  _.each (a,function (l,i){
    res = i < b.length ? l.localeCompare (b[i]) : -1;
    return !res;
  });

  return res || (a.length - b.length);

};


exports.post = function (req,res) {

  var fileName ='tmp.txt';
  var wrongCount = 0;
  var successCount = 0;
  var alreadyKnownWords = 0;

  var finish = function () {
    var fail = '\n' + wrongCount + ' words didn\'t match RegExp';
    var success = '\n' + successCount + ' words were added';
    var overwritten = '\n' + alreadyKnownWords + ' words were overwritten';
    console.log(fail, success, overwritten);
    res.write(fail);
    res.write(success);
    res.end(overwritten);

    fs.unlink(fileName,function(){
      console.log (fileName, 'deleted');
    });

  };


  var accentLess = function (line) {

    var to = ['a','c','e','e','i','s','u','u','z'],
      from = 'ąčęėįšųūž';

    var re = new RegExp ('['+from+']','ig');

    var atext = line.replace(re,function(m){
      return  to[from.indexOf(m)];
    });

    return (atext);

  };

  var processLine = (line) => {

    processLineAsync (line,(err) => {
      if (err) {
        throw (err);
      }
    });

  };

  var processLineAsync = function (line, done) {

    var word = line.toLowerCase();

    if (word && !word.match(/[^a-prstuvyząčęėįšųūž]/ig)) {

      var accentLessWord = accentLess(word);

      redisClient.HGET([ACCENTUATED_WORDS, accentLessWord], function(err, w){

        if (err){
          debug ('processLine error', 'word:', word);
          throw err;
        }

        var words = w && w.split (',') || [];

        if (words.indexOf(word)>=0) {
          alreadyKnownWords++;
          return done();
        }

        words.push(word);

        redisClient.HSET([ACCENTUATED_WORDS, accentLessWord, words.join(',')], err => {

          if (err) {
            return done(err);
          }

          successCount++;
          redisClient.ZADD([DICTIONARY_KEY, 0, word], (err,reply) => {

            if (err){
              return done(err);
            }

            if (reply) {
              redisClient.ZADD([DICTIONARY_KEY, 0, accentLessWord], done);
            } else {
              done ();
            }

          });

        });

      });

    } else {
      wrongCount++;
      done();
    }

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
