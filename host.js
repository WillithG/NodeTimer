var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
const PORT = '8081';
const public_dir = __dirname + '/public/';

app.use(express.static(public_dir)); // allow client to access public resources

// route index url to index.html
app.get('/', function(req, res) {
    res.sendFile(public_dir + 'index.html');
})

// client sends lapped study time, send this time to the databas
// TODO begin ths function:
// 1) create database node files, 
// 2) update this function
// 3) update app js files to send a post request
app.post('/post_time', urlencodedParser, function(req, res) {
    console.log(req.body.time);
})

// start the server listening
var server = app.listen(PORT, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log(`Stopwatch app server listening @ ${host}:${port}`);
})