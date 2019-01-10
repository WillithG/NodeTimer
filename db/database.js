var mysql = require('mysql');
var input_utils = require('./../utils/validation_util.js');
module.exports = {
    post_time: post_time,
    get_time_today: get_time_today
};

var con =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'studystopwatch'
});

/* Private: wrapper function for executing an SQL query, and outputting a success message.
    Throws error if the query is not sucessful.
   inputs:
    query :: string; the query to be executed
    succ_msg :: string; the string to be output to console if the query is successful. 
*/
// CHANGE THIS TO TAKE A CALLBACK FUNCTION RATHER THAN A SUCC_MSG
var execute_query = function(query, succ_msg) {
    con.query(query, function(err, result) {
         if (err) {
            console.log(err);
        }
        else {
            if (succ_msg) {
                console.log(succ_msg);
            }
        }
    });
}


/*
    Public: used to submit times to push a new study time to the database
    inputs:
      id :: string; name of user to associate the time with
      time :: int; the time in number of milliseconds
      type :: string; the type of time to be pushed, either 'break' or 'study'
    output: bool; success of query
*/
function post_time(id, time, type) {
    // validate the input
    var id_valid = input_utils.validate_userid(id);
    var time_valid = input_utils.validate_time(time);
    var type_valid = type == 'break' || type == 'study';
    // execute query
    query = `
    INSERT INTO times (userid, timeofperiod, dateofperiod, typeofperiod)
    VALUES (${id}, ${time}, CURDATE(), '${type}');
    `;
    var succ = execute_query(query, `time ${id}, ${time} inserted`);
    return succ;
}
/*
    query the database for the total time studied today for the passed user
    inputs:
        userid :: int; id of user to be queried
        callback :: function(err, result); function to be called upon query completion.
*/
function get_time_today(userid, callback) {
    query = `
    SELECT timeofperiod
    FROM times
    WHERE dateofperiod=CURDATE();
    `
    var result = 'yeet';
    con.query(query, function(err, res) {
        if (err) {callback(err, null);}
        else {callback(null, res);} 
    })
}


/* Private: Sanitize the input provided by the client
   inputs:  
   refer to this https://flaviocopes.com/express-sanitize-input/
   https://expressjs.com/en/advanced/best-practice-security.html
*/
// no need for sanitization at this time, because all user inputs are integers.
