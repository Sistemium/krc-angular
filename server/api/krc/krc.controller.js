'use strict';
var request = require('request')
  , cheerio = require('cheerio')  /* HTML parser */
  , redis = require('redis')
  , redisClient = redis.createClient();

var link = 'http://donelaitis.vdu.lt/main.php?id=4&nr=9_1'; /* alternative http://www.zodynas.lt/kirciavimo-zodynas; form property == text */

exports.index = function(req, res){
  console.log('\nWord typed:', req.params.word);

  var text =  req.params.word; /* Viena for testing */
  text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();  /* uppercase first letter lowercase other*/

  redisClient.get(text, function (err, response) {
    if (err) {
      console.log(err);
    }
    if (!response) {
      sendRequest(res, text);
    } else if (response === '404') {
      // send failMsg
    } else {

      try {
        var parsed = JSON.parse(response);
        res.send(parsed);
      } catch (e) {
        sendRequest(res, text);
      }

    }
  });
};

function sendRequest (res, text) {

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

    function formWordStructure(stressArray) {
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
    }

    if(arrLen != 0){

      formWordStructure(stressArray);

      if (wordApi.length) {
        redisClient.set(text, JSON.stringify(wordApi));
        res.status(200).json(wordApi);
      } else {
        res.status(404).send(failMsg);
      }

    }
    else{
      console.log('You\'ve got', false, 'value. Please check the spelling of the word', '\''+text+'\' \n');
      // write to redis incorrect text
      //redisClient.set(text, "404");  /* If not found don't write to redis */
      res.status(404).send(failMsg);
    }

  });
}

