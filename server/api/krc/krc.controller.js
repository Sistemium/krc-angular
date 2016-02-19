'use strict';
var request = require('request'),
  fs = require('fs'),
  cheerio = require('cheerio'), /* HTML parser */
  redisClient = require('../../config/redis').redisClient,
  stats = require('../waterline/stat.controller'),
  moment = require('moment');

var link = 'http://donelaitis.vdu.lt/main.php?id=4&nr=9_1';
// alternative http://www.zodynas.lt/kirciavimo-zodynas; form property == text

var WORDS_HASH = 'kirtis_found_words';
var NOT_FOUND_SET = 'kirtis_not_found_words';
var debug = require('debug')('krc:controller');



exports.index = function (req, res) {


  debug('Word typed:', req.params.word);
  var text = req.params.word; // Viena for testing
  text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(); // uppercase first letter lowercase other
  var failmsg = 'You\'ve got ' + false + ' value. Please check the spelling of the word "' + text + '"';

  redisClient.HGET(WORDS_HASH, text, function (err, response) {

    if (err) {
      console.log(err);
    }

    if (!response) {
      redisClient.SISMEMBER(NOT_FOUND_SET, text, function (err, r) {
        if (err) {
          console.log(err);
        }


        if (r === 1) {
          debug('Word found in a database.\nGetting word', text, 'from', NOT_FOUND_SET, 'database at', Date());
          res.status(404).send(failmsg);
        } else {
          sendRequest(res, text);
        }
      });
    } else {
      try {
        var parsed = JSON.parse(response);
        res.send(parsed);
        debug('Word found in a database.\nGetting word', text, 'from', WORDS_HASH, 'database at', Date());
      } catch (e) {
        sendRequest(res, text);
      }

    }
  });
};

function sendRequest(res, text) {
  request({
    uri: link,
    method: 'POST',
    form: {
      tekstas: text
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      var stressedWord = $('textarea').last().text();
    }
    else {
      return res.status(500).send('The server is down. Please try later.');
    }

    var stressArray = stressedWord.split('\r\n');
    /* turning string to a string array */
    stressArray.splice(-1, 1);
    /* deleting the last array elem. which is empty string */
    var regexp = /^[^ ]+[ ]([^ ]+) \(([^)]+)/;
    var regexpNoState = /[^\d.\s][^()]/g;
    var wordApi = [];  // stressed word state and etc
    var arrLen = stressArray.length;
    /* Count of stressed word found. ex. Viena 15*/

    function formWordStructure(stressArray) {
      stressArray.forEach(function (item) {
        var mtch = item.match(regexp);

        if (mtch != null) {
          var smth = mtch[2].split(' ');
          var jsonObj = {};
          jsonObj.word = mtch[1];
          jsonObj.class = smth.shift();
          jsonObj.state = smth;
          wordApi.push(jsonObj);
        }

        else {
          var jsonObj = {};
          jsonObj.word = stressArray.join(' ').match(regexpNoState).join('');
          jsonObj.class = 'dktv.';
          /* Not sure, but fits well */
          wordApi.push(jsonObj);
        }

      });
    }

    // Writing a searched (found and not found) words to redis database if they're not in the database already

    if (arrLen != 0) {

      formWordStructure(stressArray);

      if (wordApi.length) {

        redisClient.HSET(WORDS_HASH, text, JSON.stringify(wordApi), function (err, r) {

          if (r === 1) {
            debug('Word found. \nWord', text, 'added to', WORDS_HASH, 'database', 'on', Date());
          }

          else {
            console.log('Error occurred while writing to a database', WORDS_HASH);
          }

          res.status(200).json(wordApi);

        });
      }

    }
    else {

      redisClient.SADD(NOT_FOUND_SET, text, function (err, r) {

        if (r === 1) {
          debug('Word not found.\nWord', text, 'added to', NOT_FOUND_SET, 'database on', Date());
        }

        else {
          console.log('Error occurred while writing to a database', NOT_FOUND_SET);
        }

        var failmsg = 'You\'ve got ' + false + ' value. Please check the spelling of the word "' + text + '"';

        res.status(404).send(failmsg);

      });
    }

  });
}

