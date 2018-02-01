const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const os = require('os');
const csv = require('fast-csv');
const csvjson = require('csvjson');
const csvFilePath = ('server/log.csv');
var bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());


// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.csv'), { flags: 'a' });
csv.write([['Agent', 'Time', 'Method', 'Resource', 'Version', 'Status'], []], { headers: false, delimiter: ',' }).pipe(accessLogStream);
//app.use(morgan('dev'));

app.use((req, res, next) => {
    // write your logging code here
    var user = [
        req.get('User-Agent').replace(',', ''),
        // req.headers['user-agent'],
        new Date().toISOString(),
        req.method,
        req.url,
        "HTTP/" + req.httpVersionMajor + '.' + req.httpVersionMinor,
        res.statusCode
    ].join(',') + '\n';
   
    fs.appendFile('server/log.csv', user, function (err) {
        if (err) throw err;
        console.log(user);
        next();
    });
});

app.get('/', (req, res) => {
    // write your code to respond "ok" here
    res.send('ok');

    var user = [
        req.get('User-Agent').replace(',', ''),
        // req.headers['user-agent'],
        new Date().toISOString(),
        req.method,
        req.url,
        "HTTP/" + req.httpVersionMajor + '.' + req.httpVersionMinor,
        res.statusCode
    ].join(',') + '\n';

    res.send(user);

});



app.get('/logs', (req, res,next) => {
    // write your code to return a json object containing the log data here
    var data = fs.readFileSync(path.join(__dirname, 'log.csv'), { encoding : 'utf8'});
    var options = {
        delimiter : ',', // optional
        quote     : '"' // optional
        
      };
      var data2= csvjson.toObject(data, options);
      
      res.json(data2);
      console.log(data2);
      




    //res.json(data2);
});

module.exports = app;





