 /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

var fs = require('fs');
var express = require('express');
var bodyparser = require('body-parser');
var app = express();

var test = new Date("2012 Dec sdfad");
console.log("unix: ", test.getTime());
console.log("utc: ", test.toUTCString())

//based on character given, determine if it is a letter, number, or other
const charType = function(ch){
  if (ch >= 'a' && ch <= 'z'){
    return "letter"
  }
  else if (ch >= '0' && ch <= '9'){
    return "number"
  }
  else{
    return "other"
  }
}

//used for external verification process
if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}



app.use('/public', express.static(process.cwd() + '/public')); //allows style.css to be seen and used  
app.use(bodyparser.urlencoded({extended: false})); //allows url to be parsed

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  
app.route('/') //intro page with instructions
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })

app.get("/api/timestamp/", (req,res)=>{ //take param from url and use in reponse
  let date = new Date();
  res.json({"unix": date.getTime(), "utc": date.toUTCString()});
});

app.get("/api/timestamp/:date", (req,res)=>{ //take param from url and use in reponse
  //example url: .../Alex/echo -> returns: {echo: "Alex"}
  let input = req.params.date;
  if(/^\d+$/.test(input)){
    input = parseInt(input);
  }
  let date = new Date(input);
  if(date.toUTCString() == "Invalid Date"){
    res.json({"error": "Invalid Date"});
  }else{
    res.json({"unix": date.getTime(), "utc": date.toUTCString()});
  }
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

