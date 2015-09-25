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
});
