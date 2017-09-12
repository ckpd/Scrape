var express	= require('express');
var fs		= require('fs');
var request	= require('request');
var cheerio 	= require('cheerio');
let axios = require('axios');
var schedule = require('node-schedule');
var date = new Date();
var app		= express();

var port = process.env.PORT || 8081;


var rule = new schedule.RecurrenceRule();


rule.minute = new schedule.Range(0, 60, 5);


var dailyJob = schedule.scheduleJob(rule, function(){

    let base_url = 'http://nla.gd/winning-numbers/view/super_six/2017-06-03/2017-09-03/';

    axios.get(base_url).then( (response) => {
      let $ = cheerio.load(response.data);
      let kurs = [];

      $('tr').each( (i, elm) => {
        kurs.push( {
            metadata: {
                Date: $(elm).children().first().text(),
                winningNumbers: $(elm).children().eq(1).first().text(),
                FTL: $(elm).children().eq(2).first().text(),
                DrawId: $(elm).children().eq(3).first().text()
          }
            
        });

      });
      return(kurs);

    })
    
    .then ( (kurs) => {
            kurs.shift();
            fs.writeFile('output.json', JSON.stringify(kurs, null, 2), function(err){
                
            console.log(kurs);

        })  
    });
});


var dailyJob2 = schedule.scheduleJob(rule, function(){

    let base_url2 = 'http://www.nla.gd/winning-numbers/';

    axios.get(base_url2).then( (response) => {
      let $ = cheerio.load(response.data);
      let kurs = [];
      $('div.side-module-1').each( (i, elm) => {
        kurs.push( {
            metadata: {
                Date: $(elm).find('span').text().trim(),
                winningNumbers: $(elm).find('div').first().text().trim(),
                FTL: $(elm).find('div').eq(1).text().trim(),
                DrawId: $(elm).find('h1').text().trim()
          }
            
        });

      });
      return(kurs);

    })
    
    .then ( (kurs) => {

            fs.writeFile('allwinning.json', JSON.stringify(kurs, null, 2), function(err){
                
            console.log(kurs);

        })  
    });
});


app.get('/allwinning', function(req,res){    
  
        var obj = JSON.parse(fs.readFileSync('output.json', 'utf8',2));
        res.send(obj);

});


app.get('/scrape', function(req,res){    
  
        var obj = JSON.parse(fs.readFileSync('allwinning.json', 'utf8',2));
        res.send(obj);

});
	
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});;

