'use strict';

exports.index = function(req, res, next){
  console.log('\nWord typed:', req.params.word);
  var request = require('request');
  var redis = require('redis'),
    client = redis.createClient();
  var cheerio = require('cheerio');  /* HTML parser */
  var link = 'http://donelaitis.vdu.lt/main.php?id=4&nr=9_1'; /* alternative http://www.zodynas.lt/kirciavimo-zodynas; form property == text */
  var text =  req.params.word; /* Viena for testing */
  text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();  /* uppercase first letter lowercase other*/


  request({
    uri: link,
    method: 'POST',
    form: {
      tekstas: text
    }
  }, function(error, response, body) {
    if(!error && response.statusCode == 200){
      var $ = cheerio.load(body);
      var stressedWord = $('textarea').last().text();
    }
    else {
      return res.status(500).send('The server is down. Please try later.');
    }

    var stressArray = stressedWord.split('\r\n');  /* turning string to a string array */
    stressArray.splice(-1,1); /* deleting the last array elem. which is empty string */
    var regexp = /^[^ ]+[ ]([^ ]+) \(([^)]+)/;
    var wordApi = [];
    var arrLen = stressArray.length;
    var failMsg = 'Sorry, we cannot find Your word! Please check the spelling of the word.';

    if(arrLen != 0){

      stressArray.forEach(function (item){
        var mtch = item.match(regexp);
        if(mtch != null) {
          var smth = mtch[2].split(' ');
          var jsonObj = {};
          jsonObj.word = mtch[1];
          jsonObj.class = smth.shift();
          jsonObj.state = smth;
          wordApi.push(jsonObj);
        }
      });

      if (wordApi.length) {
        res.status(200).json(wordApi);
      } else {
        res.status(404).send(failMsg);
      }

    }
    else{
      wordApi[0] = text; /* if text was not found write word to first array position */
      var checkIfEmpty = false;
      console.log('You\'ve got', checkIfEmpty, 'value. Please check the spelling of the word', '\''+wordApi[0]+'\' \n');
      res.status(404).send(failMsg);
    }

  });
};

