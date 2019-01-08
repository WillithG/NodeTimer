var express = require('express');
var app = express();
var bodyParser = require('body-parser');
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
    Send total time studied for today, upon request
*/
app.get('/get_time_today', urlencodedParser, function(req, res) {
    // validate the userid (may be invalid, because user does not input this)
    if (!validate_userid(req.body.userid)) {
        res.sendStatus(400);
    }
    function callback(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        else {
            var totalTime = total_today_JSON_to_formatted(result);
            res.send(totalTime);
            res.end();
        }
    }
    db.get_time_today(req.body.userid, callback);
});

// client sends lapped study time, send this time to the databas
// TODO begin ths function:
// 1) create database node files, 
// 2) update this function
// 3) update app js files to send a post request
app.post('/post_time', urlencodedParser, function(req, res) {
    console.log(req.body.time);
    if (!validate_time(req.body.time) || !validate_userid(req.body.userid) || !validate_time_type(req.body.type)) {
        res.sendStatus(400); // bad request
    }
    
    var time_as_seconds = convert_input_time_seconds(req.body.time);
    console.log('time as seconds: ' + time_as_seconds);
    var succ = db.post_time(req.body.userid, time_as_seconds, req.body.type);
    // (succ) ? res.sendStatus(200) : res.sendStatus(400);
    res.sendStatus(200);
    res.end();
})

// TODO MOVE THESE FUNCTIONS TO A TIME-UTILS FILE
/*
    TODO TEST THIS
    Convert the time as string into seconds. Passed time must be pre-validated
    inputs:
        input_time :: string; pre-validated string which represents the stopwatch time at submission
    Ouputs: int; the passed time in seconds
*/
var convert_input_time_seconds = function(input_time) {
    // two time format possibilities: 
    // hhh : mm : ss or mm : ss . lll;
    // initialize all time types
    var hours = 0;
    var minutes = 0;
    var seconds = 0;
    const hours_to_sec = 3600
    const mins_to_sec = 60;
    var time_as_sec = 0;
    // 1) identify string format, 2) extract data.
    var no_ms_patt = /[0-9]+ : [0-9]{2} : [0-9]{2}/;
    var no_hr_patt = /[0-9]{2} : [0-9]{2} . [0-9]{3}/;
    var is_no_hr_time = no_hr_patt.test(input_time);
    var is_no_ms_time = no_ms_patt.test(input_time);
    var split_time = input_time.split(' ');
    if (is_no_hr_time) {
        // extract data when there are no hours.
        // eg. '01 : 23 : 456' => ["01", ":", "23", ":", "456"]
        minutes = parseInt(split_time[0], 10);
        seconds = parseInt(split_time[2], 10);
    } else if (is_no_ms_time) {
        // eg. '123 : 45 : 67' => ["123", ":", "45", ":", "67"]
        hours = parseInt(split_time[0], 10);
        minutes = parseInt(split_times[2], 10);
        seconds = parseInt(split_time[4], 10);
    }
    total_time = seconds + mins_to_sec * minutes + hours_to_sec * hours;
    return total_time;
}

// fookin test this
// document this ya lazy bastard
function total_today_JSON_to_formatted(JSON_res) {
    var total_time = 0;
    for (var key in JSON_res) {
        total_time += JSON_res[key].timeofperiod;
    }
    return total_time.toString();
}

// TODO DOCUMENT, MOVE, AND UPDATE THESE VALIDATION FUNCTIONS:
validate_time = function(time) {
    return true;
}
validate_userid = function(userid) {
    return true;
}
validate_time_type = function(time_type) {
    return time_type == 'study' || time_type == 'break';
}


// start the server listening
var server = app.listen(PORT, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log(`Stopwatch app server listening @ ${host}:${port}`);
})