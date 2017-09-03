var express	= require('express');
var fs		= require('fs');
var request	= require('request');
var cheerio 	= require('cheerio');
let axios = require('axios');
var schedule = require('node-schedule');
var date = new Date();

var app		= express();

var rule = new schedule.RecurrenceRule();

rule.minute = new schedule.Range(0, 59, 60);



var dailyJob = schedule.scheduleJob(rule, function(){
      let axios = require('axios');
    let cheerio = require('cheerio');

    let base_url = 'http://nla.gd/winning-numbers/view/super_six/2017-06-03/2017-09-03/';
    var count = 0;

    axios.get(base_url).then( (response) => {
      let $ = cheerio.load(response.data);
      let kurs = [];

      $('tr').each( (i, elm) => {
        count++;
        kurs.push( {
            count: count,
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





app.get('/scrape', function(req,res){    
  
        var obj = JSON.parse(fs.readFileSync('output.json', 'utf8',2));
        res.send(obj);


	//all web scraping magic will happen here
//	url = "http://nla.gd/winning-numbers/view/super_six/2017-06-03/2017-09-03/";
//    
//    
//        request(url, function(error, response, html){
//  if (!error && response.statusCode == 200) {
//  
//            var $ = cheerio.load(html);
//
////            var gameTitle, prizeAmount, winningNumbers;
////            var json = { gameTitle : "", prizeAmount : "", winningNumbers:""};
////            $('.subpage-main-content-top-right-gamejackpot').filter(function(){
////                var data = $(this);
////                
////                
////                prizeAmount = data.children().first().text();
////                
////                json.prizeAmount = prizeAmount;
////                
////                
////            
////            });
////            
//            $('table.winning td').each(function(i, element){
//                    var a = $(this);
//                    var title = a.text();
//                    var rank = "16-06-2017";
//                       var metadata = {
//                           rank: parseInt(rank),
//                            title: title,
////                            url: url,
////                            points: parseInt(points),
////                            username: username,
////                            comments: parseInt(comments)
//                          };
//                console.log(metadata);
//
//            })
//        }
////    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
////
////        console.log('File successfully written! - Check your project directory for the output.json file');
////
////    })
//    res.send('Check your console!')
//        })
});
	

app.listen('8081');

console.log('connected on port 8081');
exports = module.exports = app;

