/* Server side*/

var request = require('request');
var cheerio = require('cheerio');  /* HTML parser */

var link = 'http://donelaitis.vdu.lt/main.php?id=4&nr=9_1'; /*alternative http://www.zodynas.lt/kirciavimo-zodynas; form property == text*/

request({
  uri: link,
  method: 'POST',
  form: {
    tekstas: 'Namas'
  }
}, function(error, response, body) {
  if(!error && response.statusCode == 200){
    var $ = cheerio.load(body);
    var stressedWord = $('textarea').last().text();
    console.log(stressedWord);
  };
  }
  else {
    console.log('Error, Please try later');
  }

  var stressArray = stressedWord.split('\r\n');  /* turning string to a string array */
  stressArray.splice(-1,1); /* deleting the last array elem. which is empty string */
  var regexp = /^[^ ]+[ ]([^ ]+) \(([^)]+)/;
  var wordApi = [];
  var arrLen = stressArray.length;

  if(arrLen != 0){
    stressArray.forEach(function (item, i){
      var mtch = item.match(regexp);
      var smth = mtch[2].split(' ');
      var jsonObj = {};
      jsonObj.word = mtch[1];
      jsonObj.class = smth.shift();
      jsonObj.state = smth;
      wordApi[i] = jsonObj;
    });
    wordApi[arrLen] = jsonObj = {totalWordsFound: arrLen};
    var checkIfEmpty = false;
  }
  else{
    wordApi[0] = text; /* if text was not found write word to first array position */
    var checkIfEmpty = true;
    console.log('You\'ve got', checkIfEmpty, 'value. Please check the spelling of the word', '\''+wordApi[0]+'\'');
  }

});
