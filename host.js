var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var utilPath = __dirname + '/utils/';
var time_utils = require(utilPath + 'time_util.js');
var input_utils = require(utilPath + 'validation_util.js');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var db = require(__dirname + '/db/database.js');
const PORT = '8081';
const public_dir = __dirname + '/public/';

app.use(express.static(public_dir)); // allow client to access public resources

// route index url to index.html
app.get('/', function(req, res) {
    res.sendFile(public_dir + 'index.html');
});


/*
    Send total time studied for today for the passed user, upon request
*/
app.get('/get_time_today', urlencodedParser, function(req, res) {
    // validate the userid (may be invalid, because user does not input this)
    if (!input_utils.validate_userid(req.query.userid)) {
        res.sendStatus(400);
    }
    function callback(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        else {
            var totalTime = time_utils. total_today_JSON_to_formatted(result);
            res.send(totalTime);
            res.end();
        }
    }
    db.get_time_today(req.query.userid, callback);
});

/*
    Posts passed time to database. Time and user send to server via post request
*/
app.post('/post_time', urlencodedParser, function(req, res) {
    console.log(req.body.time);
    if (!input_utils.validate_time(req.body.time) || !input_utils.validate_userid(req.body.userid) || !input_utils.validate_time_type(req.body.type)) {
        res.sendStatus(400); // bad request
        res.end();
    } else {
        console.log(input_utils.validate_time(req.body.time));
        var time_as_seconds = time_utils. convert_input_time_seconds(req.body.time);
        console.log('time as seconds: ' + time_as_seconds);
        db.post_time(req.body.userid, time_as_seconds, req.body.type, function(err, result) {
            if (err) {
                res.sendStatus(400);
            } else {
                res.sendStatus(200);
            }
            res.end();
        });
    }
});


app.get('/get_week_data', urlencodedParser, function(req, res) {
    if (!input_utils.validate_userid(req.query.userid)) {
        res.sendStatus(400);
        return;
    }
    db.get_time_past_week(req.query.userid, function(seconds_past_week) {
        var hours_past_week = seconds_past_week.map(function(sec){
            return Math.round((sec / 3600) * 100) / 100;
        });
        res.send(hours_past_week);
        res.end();
        });
    });

// start the server listening
var server = app.listen(PORT, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log(`Stopwatch app server listening @ ${host}:${port}`);
})